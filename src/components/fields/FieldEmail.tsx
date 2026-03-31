import { useState } from "react";
import { TextField } from "datocms-react-ui";

type FieldSettings = {
	title: string | undefined;
	url: string | undefined;
};

const resetObject: FieldSettings = {
	title: "Email address",
	url: "mailto:",
};

type Props = {
	ctx: any;
	savedFieldSettings: FieldSettings;
	onValueUpdate: (value: any) => void;
};

const FieldEmail = ({
	ctx: _ctx,
	savedFieldSettings,
	onValueUpdate,
}: Props) => {
	const [fieldSettings, setFieldSettings] =
		useState<FieldSettings>(savedFieldSettings);
	const updateValue = (newObject: any) => {
		let url = newObject.url
			? newObject.url.replace(/[^\w@.-]/g, "").replace("mailto", "")
			: "";
		url = `mailto:${url}`;

		const emailData: FieldSettings = {
			...resetObject,
			...newObject,
			url,
		};

		setFieldSettings(emailData);
		onValueUpdate(emailData);
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

export default FieldEmail;
