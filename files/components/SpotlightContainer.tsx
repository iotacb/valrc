import React, { useRef, useEffect } from "react";

type Props = {
	children: React.ReactNode;
	className?: string;
	containerRef: React.RefObject<HTMLDivElement>;
};

export default function SpotlightContainer({
	children,
	className = "",
	containerRef,
}: Props) {
	const spotlightRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (spotlightRef && spotlightRef.current) {
			const spotlight = spotlightRef.current as HTMLInputElement;
			const spotlightEffect = (e: MouseEvent) => {
				const rect = spotlight.getBoundingClientRect();
				const x = e.clientX - rect.left;
				const y = e.clientY - rect.top;

				spotlight.style.setProperty("--mouse-x", `${x}px`);
				spotlight.style.setProperty("--mouse-y", `${y}px`);
			};

			window.addEventListener("mousemove", spotlightEffect);
		}

		if (containerRef && containerRef.current) {
			const container = containerRef.current as HTMLInputElement;
			container.addEventListener("mouseenter", () => {
				container.classList.add("spotlight-card-hover");
			});

			container.addEventListener("mouseleave", () => {
				container.classList.remove("spotlight-card-hover");
			});
		}

		return () => {
			window.removeEventListener("mousemove", () => {});
		};
	}, [containerRef]);

	return (
		<div ref={spotlightRef} className={`spotlight-card ${className}`}>
			<div className="spotlight-card-content group-hover:spotlight-card-hover">
				{children}
			</div>
		</div>
	);
}
