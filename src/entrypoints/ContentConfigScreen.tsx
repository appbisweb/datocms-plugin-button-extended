import { useState, useRef } from "react";
import {
	Canvas,
	Form,
	SelectField,
	SwitchField,
	TextField,
} from "datocms-react-ui";
import { getCtxParams, getDefaultValue } from "../utils/helpers";

import FieldAsset from "../components/fields/FieldAsset";
import FieldRecord from "../components/fields/FieldRecord";
import FieldTel from "../components/fields/FieldTel";
import FieldEmail from "../components/fields/FieldEmail";
import FieldUrl from "../components/fields/FieldUrl";

import styles from "../styles/styles.ContentConfigScreen.module.css";

type PropTypes = {
	ctx: any;
};

type LinkTypeSting = "record" | "asset" | "url" | "tel" | "email" | "";
type LinkTypeData = { label: string; value: LinkTypeSting };
type StylingTypeData = {
	label: string;
	value: string;
	allowIcons?: boolean;
};
type IconTypeData = { label: string; value: string };
type RecordData = {
	cms_url: string | undefined;
	id: string | undefined;
	slug: string | undefined;
	status: string | undefined;
	title: string | undefined;
	url: string | undefined;
	modelApiKey?: string | undefined;
	modelData?:
		| {
				id: string;
				api_key: string;
				label: string;
		  }
		| undefined;
};

type AssetData = {
	alt: string | undefined;
	cms_url: string | undefined;
	id: string | undefined;
	status: string | undefined;
	title: string | undefined;
	url: string | undefined;
};

type UrlData = {
	title: string | undefined;
	url: string | undefined;
};
type TelData = {
	title: string | undefined;
	url: string | undefined;
};
type MailData = {
	title: string | undefined;
	url: string | undefined;
};

type StoredData = {
	linkType: LinkTypeData;
	stylingType: StylingTypeData;
	iconType: IconTypeData;
	record: RecordData;
	asset: AssetData;
	url: UrlData;
	tel: TelData;
	email: MailData;
	custom_text: string | number | readonly string[] | undefined;
	aria_label: string | number | readonly string[] | undefined;
	open_in_new_window: boolean;
	nofollow: boolean;
	formatted: any;
	isValid: boolean;
	plugin_version: string;
};

const initialStoredData: StoredData = {
	linkType: {} as LinkTypeData,
	stylingType: {} as StylingTypeData,
	iconType: {} as IconTypeData,
	record: {} as RecordData,
	asset: {} as AssetData,
	url: {} as UrlData,
	tel: {} as TelData,
	email: {} as MailData,
	formatted: {},
	custom_text: undefined,
	aria_label: undefined,
	open_in_new_window: false,
	nofollow: false,
	isValid: false,
	plugin_version: "",
};

export default function ContentConfigScreen({ ctx }: PropTypes) {
	const storedDataRef = useRef<StoredData>({ ...initialStoredData });
	const locale: string = ctx?.locale;
	const ctxFieldParameters: any = getCtxParams(ctx, "field_settings");
	const ctxPluginParameters: any = getCtxParams(ctx, "plugin_settings");
	const ctxParameters: any = getCtxParams(ctx, "content_settings");

	const itemTypes =
		ctxFieldParameters.itemTypes || ctxPluginParameters.itemTypes || [];
	let linkTypeOptions: LinkTypeData[] =
		ctxFieldParameters?.linkTypeOptions || [];

	if (itemTypes.length === 0) {
		linkTypeOptions = linkTypeOptions.filter((e) => e.value !== "record");
	}

	const defaultLinkType = { label: "--select--", value: "" } as LinkTypeData;
	const stylingOptions = ctxFieldParameters?.stylingOptions ?? [];
	const iconOptions = ctxFieldParameters?.iconOptions ?? [];
	const allowNewTarget = ctxFieldParameters?.allow_new_target ?? true;
	const allowCustomText = ctxFieldParameters?.allow_custom_text ?? true;
	const allowAriaLabel = ctxFieldParameters?.allow_aria_label ?? true;
	const allowIcons = ctxFieldParameters?.allow_icons ?? true;
	const allowNoFollow = ctxFieldParameters?.allow_nofollow ?? true;
	const defaultRecord = {
		cms_url: undefined,
		id: undefined,
		slug: undefined,
		status: undefined,
		title: undefined,
		url: undefined,
		modelApiKey: undefined,
		modelData: undefined,
	};
	const defaultAsset = {
		alt: undefined,
		cms_url: undefined,
		id: undefined,
		status: undefined,
		title: undefined,
		url: undefined,
	};
	const defaultUrl = { title: undefined, url: undefined };
	const defaultTel = { title: undefined, url: undefined };
	const defaultEmail = { title: undefined, url: undefined };

	const hasStyling = stylingOptions && stylingOptions.length > 0;
	const hasIcons = iconOptions.length > 0 && allowIcons;

	const getRecordModel = (source: any) => {
		const url = source?.cms_url || "";
		const match = url.match(/item_types\/([A-Za-z0-9_-]+)/);
		const recordItemType = match ? match[1] : null;

		if (!recordItemType) {
			return null;
		}

		const matchingItemType =
			itemTypes.find((itemType: any) => itemType.id === recordItemType) ||
			null;

		return matchingItemType;
	};

	const getRecordModelDetails = (sourceRecord: any) => {
		if (!sourceRecord?.cms_url) {
			return null;
		}

		const recordModel = getRecordModel(sourceRecord);
		const apiKey = recordModel?.api_key
			? String(recordModel.api_key)
			: undefined;

		return {
			...sourceRecord,
			modelApiKey: apiKey,
			modelData:
				apiKey && recordModel
					? {
							id: recordModel.id,
							api_key: apiKey,
							label: recordModel.label,
						}
					: undefined,
		};
	};

	const getText = (data: any, selectedType: string) => {
		switch (selectedType) {
			case "tel":
				return (
					data?.custom_text ||
					(data?.[selectedType]?.url
						? data?.[selectedType]?.url.replace("tel:", "")
						: undefined) ||
					undefined
				);
			case "email":
				return (
					data?.custom_text ||
					(data?.[selectedType]?.url
						? data?.[selectedType]?.url.replace("mailto:", "")
						: undefined) ||
					undefined
				);
			case "url":
				return (
					data?.custom_text || data?.[selectedType]?.url || undefined
				);
			default:
				return (
					data?.custom_text ||
					data?.[selectedType]?.title ||
					undefined
				);
		}
	};

	const savedContentSettings: StoredData = {
		linkType: getDefaultValue(
			ctxParameters,
			"linkType",
			linkTypeOptions?.[0] || defaultLinkType,
		),
		stylingType: hasStyling
			? getDefaultValue(
					ctxParameters,
					"stylingType",
					stylingOptions?.[0] || undefined,
				)
			: undefined,
		iconType: hasIcons
			? getDefaultValue(
					ctxParameters,
					"iconType",
					iconOptions?.[0] || undefined,
				)
			: undefined,
		record: getRecordModelDetails(
			getDefaultValue(ctxParameters, "record", defaultRecord),
		),
		asset: getDefaultValue(ctxParameters, "asset", defaultAsset),
		url: getDefaultValue(ctxParameters, "url", defaultUrl),
		tel: getDefaultValue(ctxParameters, "tel", defaultTel),
		email: getDefaultValue(ctxParameters, "email", defaultEmail),
		formatted: getDefaultValue(ctxParameters, "formatted", {}),
		custom_text: allowCustomText
			? getDefaultValue(ctxParameters, "custom_text", undefined)
			: undefined,
		aria_label: allowAriaLabel
			? getDefaultValue(ctxParameters, "aria_label", undefined)
			: undefined,
		open_in_new_window: allowNewTarget
			? getDefaultValue(ctxParameters, "open_in_new_window", false)
			: false,
		nofollow: allowNoFollow
			? getDefaultValue(ctxParameters, "nofollow", false)
			: false,
		isValid: getDefaultValue(ctxParameters, "isValid", false),
		plugin_version: getDefaultValue(
			ctxPluginParameters,
			"version",
			undefined,
		),
	};
	const [contentSettings, setContentSettings] =
		useState<StoredData>(savedContentSettings);

	const selectedStyleAllowsIcons =
		!hasStyling || contentSettings.stylingType?.allowIcons === true;
	const showIconSelect = hasIcons && selectedStyleAllowsIcons;

	const updateContentSettings = async (valueObject: any) => {
		let data = {
			...storedDataRef.current,
			...contentSettings,
			...valueObject,
		};

		if (data?.record && Object.keys(data.record).length > 0) {
			const record = getRecordModelDetails(data.record);
			if (record) {
				data.record = { ...record };
			}
		}

		const selectedType: LinkTypeSting = data.linkType.value;

		data = {
			...data,
			record: selectedType === "record" ? data.record : defaultRecord,
			asset: selectedType === "asset" ? data.asset : defaultAsset,
			url: selectedType === "url" ? data.url : defaultUrl,
			tel: selectedType === "tel" ? data.tel : defaultTel,
			email: selectedType === "email" ? data.email : defaultEmail,
		};

		if (selectedType === "record" && data?.record?.id) {
			data.record = getRecordModelDetails(data.record) || data.record;
		}

		const styleAllowsIcons =
			!hasStyling || data.stylingType?.allowIcons === true;
		if (!styleAllowsIcons || !hasIcons) {
			data.iconType = undefined as any;
		}

		if (!data.open_in_new_window) {
			data.nofollow = false;
		}

		const currentShowIcon = hasIcons && styleAllowsIcons;

		const formatted = {
			isValid: false,
			type: selectedType,
			modelApiKey:
				selectedType === "record"
					? data?.record?.modelApiKey
					: undefined,
			text: getText(data, selectedType),
			ariaLabel: data.aria_label ?? getText(data, selectedType),
			url: selectedType !== "" ? data?.[selectedType]?.url || null : null,
			target: data?.open_in_new_window ? "_blank" : "_self",
			rel: data?.open_in_new_window && data?.nofollow ? "nofollow" : null,
			noFollow: data?.open_in_new_window
				? data?.nofollow || false
				: false,
			class: data?.stylingType?.value || null,
			icon: currentShowIcon ? data?.iconType?.value || null : null,
		};

		formatted.isValid = formatted.text && formatted.url ? true : false;

		const newSettings = {
			...data,
			isValid: formatted.isValid,
			formatted: formatted,
		};

		storedDataRef.current = newSettings;
		setContentSettings(newSettings);

		ctx.setFieldValue(ctx.fieldPath, JSON.stringify(newSettings));
	};

	return (
		<Canvas ctx={ctx}>
			{contentSettings.linkType?.value ? (
				<Form>
					<div className={styles["link-field"]}>
						<div className={styles["link-field__row-type"]}>
							<div>
								<SelectField
									name="type"
									id="type"
									label="Type"
									value={contentSettings.linkType}
									selectInputProps={{
										options:
											linkTypeOptions as LinkTypeData[],
									}}
									onChange={(newValue) => {
										updateContentSettings({
											linkType: newValue,
										});
									}}
								/>
							</div>
							<div>
								{contentSettings.linkType.value === "record" ? (
									<FieldRecord
										ctx={ctx}
										ctxFieldParameters={ctxFieldParameters}
										ctxPluginParameters={
											ctxPluginParameters
										}
										savedFieldSettings={
											contentSettings.record
										}
										onValueUpdate={(value: any) =>
											updateContentSettings({
												record: value,
											})
										}
										locale={locale}
									/>
								) : contentSettings?.linkType?.value ===
								  "asset" ? (
									<FieldAsset
										ctx={ctx}
										savedFieldSettings={
											contentSettings.asset
										}
										onValueUpdate={(value: any) =>
											updateContentSettings({
												asset: value,
											})
										}
										locale={locale}
									/>
								) : contentSettings?.linkType?.value ===
								  "url" ? (
									<FieldUrl
										ctx={ctx}
										savedFieldSettings={contentSettings.url}
										onValueUpdate={(value: any) =>
											updateContentSettings({
												url: value,
											})
										}
									/>
								) : contentSettings?.linkType?.value ===
								  "tel" ? (
									<FieldTel
										ctx={ctx}
										savedFieldSettings={contentSettings.tel}
										onValueUpdate={(value: any) =>
											updateContentSettings({
												tel: value,
											})
										}
									/>
								) : contentSettings?.linkType?.value ===
								  "email" ? (
									<FieldEmail
										ctx={ctx}
										savedFieldSettings={
											contentSettings.email
										}
										onValueUpdate={(value: any) =>
											updateContentSettings({
												email: value,
											})
										}
									/>
								) : null}
							</div>
						</div>

						{(allowCustomText || allowAriaLabel) && (
							<div className={styles["link-field__row-title"]}>
								{allowCustomText && (
									<div>
										<TextField
											name="custom_text"
											id="custom_text"
											label="Title (Optional)"
											value={contentSettings.custom_text}
											textInputProps={{
												monospaced: true,
											}}
											onChange={(newValue) => {
												updateContentSettings({
													custom_text: newValue,
												});
											}}
										/>
									</div>
								)}
								{allowAriaLabel && (
									<div>
										<TextField
											name="aria_label"
											id="aria_label"
											label="Aria-label (Optional)"
											value={contentSettings.aria_label}
											textInputProps={{
												monospaced: true,
											}}
											onChange={(newValue) => {
												updateContentSettings({
													aria_label: newValue,
												});
											}}
										/>
									</div>
								)}
							</div>
						)}

						{(hasStyling || showIconSelect) && (
							<div className={styles["link-field__row-variant"]}>
								{hasStyling && (
									<div>
										<SelectField
											name="styling"
											id="styling"
											label="Variant"
											value={contentSettings.stylingType}
											selectInputProps={{
												options:
													stylingOptions as StylingTypeData[],
											}}
											onChange={(newValue) => {
												updateContentSettings({
													stylingType: newValue,
												});
											}}
										/>
									</div>
								)}
								{showIconSelect && (
									<div>
										<SelectField
											name="icon"
											id="icon"
											label="Icon"
											value={contentSettings.iconType}
											selectInputProps={{
												options:
													iconOptions as IconTypeData[],
											}}
											onChange={(newValue) => {
												updateContentSettings({
													iconType: newValue,
												});
											}}
										/>
									</div>
								)}
							</div>
						)}

						{allowNewTarget && (
							<div className={styles["link-field__row-bottom"]}>
								<SwitchField
									name="open_in_new_window"
									id="open_in_new_window"
									label="Open in new window"
									value={contentSettings.open_in_new_window}
									onChange={(newValue) => {
										updateContentSettings({
											open_in_new_window: newValue,
										});
									}}
								/>
								{contentSettings.open_in_new_window &&
									allowNoFollow && (
										<SwitchField
											name="nofollow"
											id="nofollow"
											label="NoFollow"
											value={contentSettings.nofollow}
											onChange={(newValue) => {
												updateContentSettings({
													nofollow: newValue,
												});
											}}
										/>
									)}
							</div>
						)}
					</div>
				</Form>
			) : (
				<div>
					<p className={styles["link-field__error"]}>
						<strong>Error!</strong> No valid link types could be
						found for this field.
						<br />
						Please add the wanted link types to the field appearance
						settings or the plugin settings
					</p>
				</div>
			)}
		</Canvas>
	);
}
