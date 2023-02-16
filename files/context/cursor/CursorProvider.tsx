import React, { useState } from "react";
import CursorContext, {
	CursorImageType,
	CursorLookType,
} from "./CursorContext";

const CursorProvider = ({ children }: { children: React.ReactNode }) => {
	const [type, setType] = useState<CursorLookType>("");
	const [image, setImage] = useState<CursorImageType>("");
	const [hidden, setHidden] = useState<boolean>(false);

	return (
		<CursorContext.Provider
			value={{ type, setType, image, setImage, hidden, setHidden }}
		>
			{children}
		</CursorContext.Provider>
	);
};

export default CursorProvider;
