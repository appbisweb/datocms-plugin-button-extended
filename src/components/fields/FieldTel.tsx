import { useState } from "react";
import { TextField } from "datocms-react-ui";

type FieldSettings = {
	title: string | undefined;
	url: string | undefined;
};

const resetObject: FieldSettings = {
	title: "Telephone number",
	url: "tel:",
};

type Props = {
	ctx: any;
	savedFieldSettings: FieldSettings;
	onValueUpdate: (value: any) => void;
};

const FieldTel = ({ ctx: _ctx, savedFieldSettings, onValueUpdate }: Props) => {
	const [fieldSettings, setFieldSettings] =
		useState<FieldSettings>(savedFieldSettings);
	const updateValue = (newObject: any) => {
		let url = newObject.url.replace(/[^\d\s()\-+]/g, "");
		url = `tel:${url}`;

		const telData: FieldSettings = {
			...resetObject,
			...newObject,
			url,
		};

		setFieldSettings(telData);
		onValueUpdate(telData);
	};

	return (
		<TextField
			name="link"
			id="link"
			label={fieldSettings?.title || resetObject.title}
			value={fieldSettings?.url || resetObject.url}
			textInputProps={{ monospaced: true }}
			onChange={(newValue) => {
				updateValue({ url: newValue });
			}}
		/>
	);
};

export default FieldTel;
