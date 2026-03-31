import { useState } from "react";
import { TextField } from "datocms-react-ui";

type FieldSettings = {
	title: string | undefined;
	url: string | undefined;
};

const resetObject: FieldSettings = {
	title: "URL",
	url: "",
};

type Props = {
	ctx: any;
	savedFieldSettings: FieldSettings;
	onValueUpdate: (value: any) => void;
};

const FieldUrl = ({
	ctx: _ctx,
	savedFieldSettings,
	onValueUpdate,
}: Props) => {
	const [fieldSettings, setFieldSettings] =
		useState<FieldSettings>(savedFieldSettings);
	const updateValue = (newObject: any) => {
		let url = newObject.url.replace(
			/[^a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=]/g,
			"",
		);

		const urlData: FieldSettings = {
			...resetObject,
			url,
		};

		setFieldSettings(urlData);
		onValueUpdate(urlData);
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

export default FieldUrl;
