import { useState } from "react";
import { FieldGroup, Button } from "datocms-react-ui";
import { Trash2 } from "lucide-react";
import styles from "./../../styles/styles.FieldRecordAsset.module.css";

type FieldSettings = {
	id: string | undefined;
	title: string | undefined;
	alt: string | undefined;
	url?: string | undefined;
	cms_url: string | undefined;
	status: string | undefined;
};

const resetObject: FieldSettings = {
	id: undefined,
	title: undefined,
	alt: undefined,
	url: undefined,
	cms_url: undefined,
	status: undefined,
};

type Props = {
	ctx: any;
	savedFieldSettings: FieldSettings;
	locale: string | null;
	onValueUpdate: (value: any) => void;
};

const FieldAsset = ({
	ctx,
	savedFieldSettings,
	locale,
	onValueUpdate,
}: Props) => {
	const [fieldSettings, setFieldSettings] =
		useState<FieldSettings>(savedFieldSettings);
	const updateAssetValue = async (asset: any) => {
		const getLocalizedData = (
			source: { [key: string]: any } | string,
			locale: string | null,
		): any => {
			return locale && typeof source === "object"
				? source[locale]
				: source;
		};
		const joinArrayWithCommaAndAmpersand = (arr: string[]) => {
			return arr.length > 1
				? arr.slice(0, -1).join(", ") + " & " + arr[arr.length - 1]
				: arr[0] || "";
		};

		let assetData: FieldSettings = { ...resetObject };
		const id = asset?.id || null;
		const filename = asset?.attributes?.filename || null;
		const title =
			getLocalizedData(asset?.attributes?.default_field_metadata, locale)
				?.title || filename;
		const altText =
			getLocalizedData(asset?.attributes?.default_field_metadata, locale)
				?.alt || title;
		const cms_url =
			asset?.attributes?.url ||
			(ctx?.site?.attributes?.internal_domain && asset?.id
				? `https://${ctx.site.attributes.internal_domain}/media/assets/${asset.id}`
				: null);
		const url = asset?.attributes?.url || null;
		const status = "published";

		if (id && (title || filename) && cms_url && status && url) {
			assetData = {
				id,
				title: title || filename,
				alt: altText || title || filename,
				cms_url,
				status,
				url,
			};
		} else if (asset !== null) {
			const errors = [];
			if (id === null) {
				errors.push("`ID`");
			}
			if (title === null) {
				errors.push("`Title`");
			}
			if (url === null) {
				errors.push("`URL`");
			}
			await ctx.alert(
				`Asset ${joinArrayWithCommaAndAmpersand(errors)} could not be found`,
			);
		}

		setFieldSettings(assetData);
		onValueUpdate(assetData);
	};

	const editAssetOfId = async (uploadId: string) => {
		const asset = await ctx.editUpload(uploadId);
		if (asset) {
			updateAssetValue(asset);
		}
	};

	const getAsset = async () => {
		const asset = await ctx.selectUpload({ multiple: false });
		updateAssetValue(asset);
	};

	return fieldSettings?.id ? (
		<FieldGroup className={styles["field__selection-group"]}>
			<p className={styles["field__selection-group__label"]}>Asset</p>
			<div className={styles["field__selection-group__content"]}>
				<Button
					buttonType="muted"
					onClick={() => editAssetOfId(fieldSettings.id!)}
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
					onClick={() => updateAssetValue(null)}
				/>
			</div>
		</FieldGroup>
	) : (
		<FieldGroup className={styles["field__selection-group"]}>
			<p className={styles["field__selection-group__label"]}>Asset</p>
			<Button
				buttonType="primary"
				className={styles["field__selection-group__button"]}
				leftIcon={
					<>
						<span className="sr-only">Asset</span>
					</>
				}
				onClick={getAsset}
			/>
		</FieldGroup>
	);
};

export default FieldAsset;
