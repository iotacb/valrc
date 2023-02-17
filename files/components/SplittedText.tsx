import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function SplittedText({
	text,
	className,
	split = "",
	x = 0,
	y = 200,
	amount = 1,
	once = true,
}: {
	text: string;
	className?: string;
	split?: string;
	x?: number;
	y?: number;
	amount?: number;
	once?: boolean;
}) {
	const [splittedText, setSplittedText] = useState<string[]>([]);
	const ref = useRef<HTMLDivElement>(null);
	const inView = useInView(ref, { amount, once });

	useEffect(() => {
		const splitted = text.split(split);
		setSplittedText(splitted);
	}, []);

	const variants = {
		hidden: {
			y,
			x,
		},
		visible: {
			y: 0,
			x: 0,
		},
	};

	return (
		<div ref={ref} className="overflow-hidden">
			{splittedText.map((word, index) => (
				<motion.span
					variants={variants}
					animate={inView ? "visible" : "hidden"}
					transition={{
						delay: index * 0.05,
						type: "spring",
						stiffness: 200,
						damping: 20,
						mass: 1,
					}}
					key={index}
					className={`inline-block ${className}`}
				>
					{word}
				</motion.span>
			))}
		</div>
	);
}
