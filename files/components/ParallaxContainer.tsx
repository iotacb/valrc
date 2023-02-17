import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

type Props = {
	children: React.ReactNode;
	offset?: number;
};

export default function ParallaxContainer({ children, offset = 50 }: Props) {
	const ref = useRef<HTMLDivElement>(null);
	const [elementTop, setElementTop] = useState(0);
	const [clientHeight, setClientHeight] = useState(0);
	const { scrollY } = useScroll();

	const initial = elementTop - clientHeight;
	const final = elementTop + offset;

	const range = useTransform(scrollY, [initial, final], [offset, -offset]);
	const y = useSpring(range, { stiffness: 400, damping: 90 });

	useEffect(() => {
		const element = ref.current;
		const resize = () => {
			if (element) {
				setElementTop(
					element.getBoundingClientRect().top + window.scrollY ||
						window.pageYOffset
				);
				setClientHeight(window.innerHeight);
			}
		};

		resize();

		window.addEventListener("resize", resize);

		return () => window.removeEventListener("resize", resize);
	}, [ref]);

	return (
		<motion.div ref={ref} style={{ y }}>
			{children}
		</motion.div>
	);
}
