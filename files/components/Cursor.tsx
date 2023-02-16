import React, { useContext, useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import CursorContext from "@/context/CursorContext";
import Image from "next/image";

type Props = {
	size?: number;
};

export default function Cursor({ size = 20 }: Props) {
	const { type, image, hidden, setHidden } = useContext(CursorContext);
	const mouseX = useMotionValue(0);
	const mouseY = useMotionValue(0);
	const scale = useMotionValue(0);

	const springMouseX = useSpring(mouseX, {
		stiffness: 300,
		damping: 30,
		mass: 1.5,
	});

	const springMouseY = useSpring(mouseY, {
		stiffness: 300,
		damping: 30,
		mass: 1.5,
	});

	const springScale = useSpring(scale, {
		stiffness: 1000,
		damping: 30,
		mass: 4,
	});

	function updateCursor(event: MouseEvent) {
		mouseX.set(event.pageX - size / 2);
		mouseY.set(event.pageY - size / 2);
	}

	useEffect(() => {
		window.addEventListener("mousemove", updateCursor);
		return () => {
			window.removeEventListener("mousemove", updateCursor);
		};
	}, []);

	useEffect(() => {
		if (type === "hover") {
			scale.set(3);
		} else if (type === "image") {
			scale.set(10);
		} else {
			scale.set(1);
		}
	}, [type]);

	return (
		<>
			<motion.div
				style={{
					x: springMouseX,
					y: springMouseY,
					scale: springScale,
					width: 20,
					height: 20,
				}}
				className={`${
					type === "image"
						? "bg-dark"
						: "bg-dark/0 backdrop-filter backdrop-invert"
				} z-50 rounded-full absolute top-0 left-0 pointer-events-none ${
					hidden ? "opacity-0" : "opacity-100"
				}`}
			>
				{type === "image" && <Image src={image} alt="Cursor" />}
			</motion.div>
			<button
				onClick={() => setHidden(!hidden)}
				className="w-20 h-20 rounded-full bg-gray-100 hover:bg-slate-200 shadow-lg fixed left-10 bottom-10 z-50"
			>
				🌫️
			</button>
		</>
	);
}
