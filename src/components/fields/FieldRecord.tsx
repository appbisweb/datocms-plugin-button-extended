import { useState } from "react";
import { FieldGroup, Button, SelectField } from "datocms-react-ui";
import { Trash2 } from "lucide-react";
import styles from "./../../styles/styles.FieldRecordAsset.module.css";

type LinkType = { label: string; api_key?: string; value: string };

type FieldSettings = {
	id: string | undefined;
	title: string | undefined;
	slug: string | undefined;
	url?: string | undefined;
	cms_url: string | undefined;
	status: string | undefined;
	modelApiKey?: string | undefined;
};

const resetObject: FieldSettings = {
	id: undefined,
	title: undefined,
	slug: undefined,
	url: undefined,
	cms_url: undefined,
	status: undefined,
	modelApiKey: undefined,
};

type Props = {
	ctx: any;
	ctxFieldParameters: any;
	ctxPluginParameters: any;
	savedFieldSettings: FieldSettings;
	locale: string | null;
	onValueUpdate: (value: any) => void;
};

const defaultLinkType: LinkType = {
	label: "--select--",
	value: "",
	api_key: "",
};

const FieldRecord = ({
	ctx,
	ctxFieldParameters,
	ctxPluginParameters,
	savedFieldSettings,
	locale,
	onValueUpdate,
}: Props) => {
	const [fieldSettings, setFieldSettings] =
		useState<FieldSettings>(savedFieldSettings);

	const itemTypes =
		ctxFieldParameters.itemTypes || ctxPluginParameters.itemTypes || [];

	const getLocalizedData = (
		source: { [key: string]: any } | string,
		locale: string | null,
	): any => {
		return locale && typeof source === "object" ? source[locale] : source;
	};
	const joinArrayWithCommaAndAmpersand = (arr: string[]) => {
		return arr.length > 1
			? arr.slice(0, -1).join(", ") + " & " + arr[arr.length - 1]
			: arr[0] || "";
	};

	const updateRecordValue = async (record: any) => {
		let recordData: FieldSettings = { ...resetObject };
		const id = record?.id || null;
		const slug =
			getLocalizedData(record?.attributes?.slug, locale) ||
			getLocalizedData(record?.attributes?.uri, locale) ||
			getLocalizedData(record?.attributes?.url, locale) ||
			null;
		const title =
			getLocalizedData(record?.attributes?.title, locale) || slug || null;
		const cms_url =
			ctx?.site?.attributes?.internal_domain &&
			record?.relationships?.item_type?.data?.id &&
			record?.id
				? `https://${ctx.site.attributes.internal_domain}/editor/item_types/${record.relationships.item_type.data.id}/items/${record.id}/edit`
				: null;
		const status = record?.meta?.status || null;
		const url = slug;

		// Get model API key from the item type relationship
		let modelApiKey: string | undefined = undefined;
		if (record?.relationships?.item_type?.data?.id) {
			const itemTypeId = record.relationships.item_type.data.id;

			const matchingItemType = itemTypes.find(
				(itemType: any) => itemType.id === itemTypeId,
			);

			// Check if we can get the API key directly from the record's item_type data
			if (record?.relationships?.item_type?.data?.attributes?.api_key) {
				modelApiKey = String(
					record.relationships.item_type.data.attributes.api_key,
				);
			} else if (matchingItemType?.api_key) {
				modelApiKey = String(matchingItemType.api_key);
			}
		}

		if (id && title && cms_url && slug && status && url) {
			recordData = { id, title, cms_url, slug, status, url, modelApiKey };
		} else if (record !== null) {
			const errors = [];
			if (id === null) {
				errors.push("`ID`");
			}
			if (title === null) {
				errors.push("`Title`");
			}
			if (slug === null) {
				errors.push("`Slug`");
			}
			await ctx.alert(
				`Record ${joinArrayWithCommaAndAmpersand(errors)} could not be found`,
			);
		}

		setFieldSettings(recordData);
		onValueUpdate(recordData);
	};

	const editRecordOfId = async (uploadId: string) => {
		const record = await ctx.editItem(uploadId);
		if (record) {
			updateRecordValue(record);
		}
	};

	const getRecordOfType = async (item: LinkType) => {
		let record = null;
		if (item.value !== "") {
			record = await ctx.selectItem(item.value, { multiple: false });
		}
		updateRecordValue(record);
	};

	return fieldSettings?.id ? (
		<FieldGroup className={styles["field__selection-group"]}>
			<p className={styles["field__selection-group__label"]}>Record</p>
			<div className={styles["field__selection-group__content"]}>
				<Button
					buttonType="muted"
					onClick={() => editRecordOfId(fieldSettings.id!)}
					className={styles["field__selection-group__result"]}
				>
					<span
						className={
							styles[`${fieldSettings.status || "published"}`]
						}
					>
						{fieldSettings.status}
					</span>
					<span
						className={
							styles["field__selection-group__result-title"]
						}
					>
						{fieldSettings.title}
					</span>
				</Button>

				<Button
					buttonSize="xs"
					buttonType="negative"
					leftIcon={
						<span
							style={{
								display: "inline-flex",
								alignItems: "center",
							}}
						>
							<Trash2
								size={14}
								strokeWidth={2}
								style={{ fill: "none" }}
							/>
						</span>
					}
					onClick={() => updateRecordValue(null)}
				/>
			</div>
		</FieldGroup>
	) : (
		<SelectField
			name="styling"
			id="styling"
			label="Record"
			value={defaultLinkType}
			selectInputProps={{
				options: itemTypes,
			}}
			onChange={(newValue: any) => getRecordOfType(newValue)}
		/>
	);
};

export default FieldRecord;
