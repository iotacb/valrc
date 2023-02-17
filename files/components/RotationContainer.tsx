import React from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

type Props = {
	startRotation?: number;
	className?: string;
};

export default function RotationContainer({
	startRotation = 45,
	className,
}: Props) {
	const rotation = useMotionValue(startRotation);
	const smoothRotation = useSpring(rotation, {
		stiffness: 100 + startRotation,
		damping: 20,
		mass: 1,
	});

	function rotate() {
		rotation.set(
			rotation.get() == -startRotation ? startRotation : -startRotation
		);
	}

	return (
		<motion.div
			onMouseEnter={rotate}
			style={{ rotate: smoothRotation }}
			className={className}
		></motion.div>
	);
}
