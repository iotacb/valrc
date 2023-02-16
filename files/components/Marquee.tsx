import {
	motion,
	useAnimationFrame,
	useMotionValue,
	useScroll,
	useSpring,
	useTransform,
	useVelocity,
	wrap,
} from "framer-motion";
import React, { useRef, useState, useEffect } from "react";

type Props = {
	children: React.ReactNode;
	velocity?: number;
	className?: string;
	spacing?: number;
};

export default function Marquee({
	children,
	velocity = 100,
	className,
	spacing,
}: Props) {
	const childRef = useRef<HTMLSpanElement>(null);
	const [gotChildSize, setGotChildSize] = useState(false);
	const [childWidth, setChildWidth] = useState(0);
	const [childs, setChilds] = useState<React.ReactNode[]>([]);
	const baseAxis = useMotionValue(0);
	const { scrollY } = useScroll();
	const scrollVelocity = useVelocity(scrollY);
	const smoothVelocity = useSpring(scrollVelocity, {
		stiffness: 400,
		damping: 50,
	});
	const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
		clamp: false,
	});

	const movement = useTransform(
		baseAxis,
		(value) => `${wrap(-childWidth - 32, 0, value)}px`
	);

	const directionFactor = useRef<number>(1);
	useAnimationFrame((t, delta) => {
		let moveBy = directionFactor.current * velocity * (delta / 1000);

		/**
		 * This is what changes the direction of the scroll once we
		 * switch scrolling directions.
		 */
		if (velocityFactor.get() < 0) {
			directionFactor.current = -1;
		} else if (velocityFactor.get() > 0) {
			directionFactor.current = 1;
		}

		moveBy += directionFactor.current * moveBy * velocityFactor.get();

		baseAxis.set(baseAxis.get() + moveBy);
	});

	useEffect(() => {
		if (childRef && childRef.current) {
			const { width } = childRef.current.getBoundingClientRect();
			setChildWidth(width);
			setGotChildSize(true);
		}
	}, [childRef]);

	useEffect(() => {
		if (gotChildSize) {
			const childs = [];
			const windowWidth = window.innerWidth;
			const childCount = Math.ceil(windowWidth / childWidth) + 1;
			for (let i = 0; i < childCount; i++) {
				childs.push(children);
			}
			setChilds(childs);
		}
	}, [gotChildSize]);

	return (
		<div
			className={`overflow-hidden w-full m-0 leading-thin uppercase flex font-extrabold whitespace-nowrap text-8xl ${className}`}
		>
			<motion.div className="" style={{ x: movement }}>
				{!gotChildSize ? (
					<span ref={childRef}>{children}</span>
				) : (
					<>
						{childs.map((child, index) => (
							<span className="mr-8" key={index}>
								{child}
							</span>
						))}
					</>
				)}
			</motion.div>
		</div>
	);
}
