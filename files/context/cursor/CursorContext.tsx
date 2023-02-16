import React, { createContext } from "react";
import { StaticImageData } from "next/image";

export type CursorLookType = "" | "hover" | "image";
export type CursorImageType = StaticImageData | null | "" | any;
export type CursorType = {
	type: CursorLookType;
	image: CursorImageType;
	hidden: boolean;
	setType: (type: CursorLookType) => void;
	setImage: (type: CursorImageType) => void;
	setHidden: (type: boolean) => void;
};

const CursorContext = createContext<CursorType>({
	type: "",
	image: "",
	hidden: false,
	setType: () => {},
	setImage: () => {},
	setHidden: () => {},
});

export default CursorContext;
