import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import React, { MouseEvent, useRef } from "react";

type Props = {
	children: React.ReactNode;
	mass?: number;
	range?: number;
	stiffness?: number;
};

export default function MouseFollowContainer({
	children,
	mass = 0.5,
	range = 20,
	stiffness = 300,
}: Props) {
	const ref = useRef<HTMLDivElement>(null);

	// Create motion values for the mouse position
	const mouseX = useMotionValue(0);
	const mouseY = useMotionValue(0);

	// Transform the mouse position to a more manageable range
	const transformedX = useTransform(mouseX, [-100, 100], [-range, range]);
	const transformedY = useTransform(mouseY, [-100, 100], [-range, range]);

	// Smooth the transform position
	const smoothX = useSpring(transformedX, {
		stiffness: stiffness,
		damping: 30,
		mass: mass,
	});
	const smoothY = useSpring(transformedY, {
		stiffness: stiffness,
		damping: 30,
		mass: mass,
	});

	function updateMouse(event: MouseEvent) {
		if (ref && ref.current) {
			// Get the bounding box of the element
			const { left, right, top, bottom } = ref.current.getBoundingClientRect();

			// Calculate the size of the element
			const width = right - left;
			const height = bottom - top;

			// Apply transform position based on mouse position and element size
			mouseX.set(event.pageX - left - width / 2);
			mouseY.set(event.pageY - top - height / 2);
		}
	}

	// Reset the transform position
	function handleMouseOut() {
		mouseX.set(0);
		mouseY.set(0);
	}

	return (
		<div ref={ref} onMouseOut={handleMouseOut} onMouseMove={updateMouse}>
			<motion.div
				style={{
					x: smoothX,
					y: smoothY,
				}}
			>
				{children}
			</motion.div>
		</div>
	);
}
