import { useState } from "react";
import {
	Form,
	FieldGroup,
	SelectField,
	SwitchField,
	Button,
} from "datocms-react-ui";
import { getCtxParams, getDefaultValue } from "../../utils/helpers";
import styles from "../../styles/styles.LinkSettings.module.css";

type PropTypes = {
	ctx: any;
	configType: string;
};

type ConfigSetting = {
	id: string;
	label: string;
	value: string | boolean | LinkType[];
};

type LinkType = {
	id?: string;
	label: string;
	api_key?: string;
	value: string;
};

const LinkSetting = ({ ctx, configType }: PropTypes) => {
	const ctxParameters: any = getCtxParams(ctx, configType);

	const savedLinkFieldSettings: ConfigSetting[] = [
		{
			id: "allow_record",
			label: "Allow Records",
			value: getDefaultValue(ctxParameters, "allow_record", true),
		},
		{
			id: "allow_assets",
			label: "Allow Assets",
			value: getDefaultValue(ctxParameters, "allow_assets", true),
		},
		{
			id: "allow_url",
			label: "Allow URL",
			value: getDefaultValue(ctxParameters, "allow_url", true),
		},
		{
			id: "allow_tel",
			label: "Allow Telephone numbers",
			value: getDefaultValue(ctxParameters, "allow_tel", true),
		},
		{
			id: "allow_email",
			label: "Allow Email addresses",
			value: getDefaultValue(ctxParameters, "allow_email", true),
		},
		{
			id: "allow_custom_text",
			label: "Allow Title",
			value: getDefaultValue(ctxParameters, "allow_custom_text", true),
		},
		{
			id: "allow_aria_label",
			label: "Allow aria-label",
			value: getDefaultValue(ctxParameters, "allow_aria_label", true),
		},
		{
			id: "allow_new_target",
			label: "Allow Target control",
			value: getDefaultValue(ctxParameters, "allow_new_target", true),
		},
		{
			id: "allow_nofollow",
			label: "Allow NoFollow",
			value: getDefaultValue(ctxParameters, "allow_nofollow", true),
		},
		{
			id: "allow_icons",
			label: "Allow Icons",
			value: getDefaultValue(ctxParameters, "allow_icons", true),
		},
		{
			id: "itemTypes",
			label: "Item Types",
			value: getDefaultValue(ctxParameters, "itemTypes", []),
		},
	];

	const linkFieldValues: any = {
		allow_record: { label: "Record", value: "record" },
		allow_assets: { label: "Asset", value: "asset" },
		allow_url: { label: "URL", value: "url" },
		allow_tel: { label: "Telephone number", value: "tel" },
		allow_email: { label: "Email address", value: "email" },
	};

	const removeNonAlphabeticalCharactersFromString = (
		input: string,
	): string => {
		const pattern = /[^a-zA-Z\s-]/g;
		const filteredString = input.replace(pattern, "");
		return filteredString;
	};

	const itemTypes: LinkType[] = Object.values(ctx?.itemTypes)
		.filter((type: any) => !type.attributes.modular_block)
		.map((value: any) => ({
			id: value.id,
			label: value.attributes.name,
			api_key: value.attributes.api_key,
			value: value.id,
		}))
		.sort((a, b) => {
			const labelA = removeNonAlphabeticalCharactersFromString(a.label);
			const labelB = removeNonAlphabeticalCharactersFromString(b.label);
			if (labelA < labelB) {
				return -1;
			}
			if (labelA > labelB) {
				return 1;
			}
			return 0;
		});

	const [configSettings, setConfigSettings] = useState<ConfigSetting[]>(
		savedLinkFieldSettings,
	);

	const updateCtx = async () => {
		const settings: { [key: string]: any } = {};
		const linkTypeOptions: any[] = [];

		configSettings.forEach((item: ConfigSetting) => {
			if (item.value === true && linkFieldValues[item.id]) {
				linkTypeOptions.push(linkFieldValues[item.id]);
			}
			settings[item.id] = item.value;
		});

		settings.linkTypeOptions = linkTypeOptions;

		const newSettings = {
			...ctxParameters,
			...settings,
			linkTypeOptions: linkTypeOptions,
		};

		if (configType === "plugin_settings") {
			ctx.updatePluginParameters(newSettings);
		} else if (configType === "field_settings") {
			ctx.setParameters({ field_settings: newSettings });
		}
	};

	return (
		<div>
			<Form
				onSubmit={updateCtx}
				className={styles["link-settings__form"]}
			>
				<SelectField
					name="styling"
					id="styling"
					label="Allowed Records"
					value={
						(configSettings.find(
							(setting) => setting.id === "itemTypes",
						)?.value as LinkType[]) || []
					}
					selectInputProps={{
						isMulti: true,
						options: itemTypes,
					}}
					onChange={(newValue: any) =>
						setConfigSettings((prevSettings) => {
							const sortedTypes = newValue.sort(
								(a: LinkType, b: LinkType) => {
									if (a.label < b.label) {
										return -1;
									}
									if (a.label > b.label) {
										return 1;
									}
									return 0;
								},
							);

							return prevSettings.map((setting) =>
								setting.id === "itemTypes"
									? { ...setting, value: sortedTypes }
									: setting,
							);
						})
					}
				/>

				<FieldGroup className={styles["link-settings__link-types"]}>
					{configSettings.slice(0, -6).map((param: ConfigSetting) => (
						<div
							key={param.id}
							className={styles["link-settings__link-type-item"]}
						>
							<SwitchField
								id={param.id}
								name={param.id}
								label={param.label}
								value={param.value as boolean}
								onChange={(newValue) => {
									setConfigSettings((prevSettings) =>
										prevSettings.map((setting) =>
											setting.id === param.id
												? {
														...setting,
														value: newValue,
													}
												: setting,
										),
									);
								}}
							/>
						</div>
					))}
				</FieldGroup>
				<FieldGroup className={styles["link-settings__link-controlls"]}>
					{configSettings
						.slice(-6, -1)
						.map((param: ConfigSetting) => (
							<div
								key={param.id}
								className={
									styles["link-settings__link-control-item"]
								}
							>
								<SwitchField
									id={param.id}
									name={param.id}
									label={param.label}
									value={param.value as boolean}
									onChange={(newValue) => {
										setConfigSettings((prevSettings) =>
											prevSettings.map((setting) =>
												setting.id === param.id
													? {
															...setting,
															value: newValue,
														}
													: setting,
											),
										);
									}}
								/>
							</div>
						))}
				</FieldGroup>

				<FieldGroup>
					<Button fullWidth type="submit" buttonType="primary">
						Save link settings
					</Button>
				</FieldGroup>
			</Form>
		</div>
	);
};

export default LinkSetting;
