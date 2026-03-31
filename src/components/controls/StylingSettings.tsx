import { useState, MouseEvent } from "react";
import { Form, Button, FieldGroup } from "datocms-react-ui";
import { Plus } from "lucide-react";

import StylingItem from "./partials/StylingItem";
import { getCtxParams, getDefaultValue } from "../../utils/helpers";

import styles from "../../styles/styles.StylingSettings.module.css";

type PropTypes = { ctx: any; configType: string };
type KeyValuePairType = {
	id: number;
	label: string;
	value: string;
	allowIcons: boolean;
};
type StylingType = { label: string; value: string; allowIcons?: boolean };

const StylingSettings = ({ ctx, configType }: PropTypes) => {
	const ctxParameters: any = getCtxParams(ctx, configType);

	const stylingOptions =
		(getDefaultValue(
			ctxParameters,
			"stylingOptions",
			[],
		) as StylingType[]) ?? [];
	const [keyValueList, setKeyValueList] = useState<KeyValuePairType[]>(
		stylingOptions.map((i, index) => ({
			id: index,
			label: i.label,
			value: i.value,
			allowIcons: i.allowIcons ?? false,
		})),
	);

	const updateCtx = async () => {
		const stylingOptions: StylingType[] = [];
		keyValueList.forEach((item: KeyValuePairType) => {
			stylingOptions.push({
				label: item.label,
				value: item.value,
				allowIcons: item.allowIcons,
			});
		});
		const settings = { ...ctxParameters, stylingOptions };

		if (configType === "plugin_settings") {
			await ctx.updatePluginParameters(settings);
		} else if (configType === "field_settings") {
			await ctx.setParameters({ field_settings: settings });
		}
		ctx.notice("Styling settings saved successfully");
	};

	const updateKeyValueList = (value: KeyValuePairType[]) => {
		const sortedArray = value.sort((a, b) => {
			if (a.label < b.label) {
				return -1;
			}
			if (a.label > b.label) {
				return 1;
			}
			return 0;
		});
		setKeyValueList(sortedArray);
	};

	const handleIdChange = (value: number, id: number) => {
		const updatedKeyValueList = [...keyValueList];
		updatedKeyValueList[id].id = value;
		updateKeyValueList(updatedKeyValueList);
	};

	const handleLabelChange = (value: string, id: number) => {
		const updatedKeyValueList = [...keyValueList];
		updatedKeyValueList[id].label = value;
		updateKeyValueList(updatedKeyValueList);
	};

	const handleValueChange = (value: string, id: number) => {
		const updatedKeyValueList = [...keyValueList];
		updatedKeyValueList[id].value = value;
		updateKeyValueList(updatedKeyValueList);
	};

	const handleAllowIconsChange = (value: boolean, id: number) => {
		const updatedKeyValueList = [...keyValueList];
		updatedKeyValueList[id].allowIcons = value;
		updateKeyValueList(updatedKeyValueList);
	};

	const deleteItem = (id: number) => {
		const updatedKeyValueList = [...keyValueList];
		updatedKeyValueList.splice(id, 1);
		updateKeyValueList(updatedKeyValueList);
	};

	function findDuplicates(items: KeyValuePairType[]): {
		duplicateIds: number[];
		duplicateLabels: string[];
		duplicateValues: string[];
	} {
		const idSet = new Set<number>();
		const labelSet = new Set<string>();
		const valueSet = new Set<string>();

		const duplicateIds: number[] = [];
		const duplicateLabels: string[] = [];
		const duplicateValues: string[] = [];

		for (const item of items) {
			idSet.has(item.id)
				? duplicateIds.push(item.id)
				: idSet.add(item.id);
			labelSet.has(item.label)
				? duplicateLabels.push(item.label)
				: labelSet.add(item.label);
			valueSet.has(item.value)
				? duplicateValues.push(item.value)
				: valueSet.add(item.value);
		}

		return {
			duplicateIds,
			duplicateLabels,
			duplicateValues,
		};
	}

	const duplicateArrays = () => {
		const { duplicateIds, duplicateLabels, duplicateValues } =
			findDuplicates(keyValueList);
		return { duplicateIds, duplicateLabels, duplicateValues };
	};

	const containsDuplicates = () => {
		const { duplicateIds, duplicateLabels, duplicateValues } =
			duplicateArrays();
		return (
			duplicateIds.length > 0 ||
			duplicateLabels.length > 0 ||
			duplicateValues.length > 0
		);
	};

	const handleAddItem = (event: MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		if (!containsDuplicates()) {
			const currentTimestamp = Date.now();
			const newList: KeyValuePairType[] = [
				...keyValueList,
				{
					id: currentTimestamp,
					label: "",
					value: "",
					allowIcons: false,
				},
			];
			updateKeyValueList(newList);
		}
	};

	return (
		<div>
			<Form
				onSubmit={updateCtx}
				className={styles["style-settings__form"]}
			>
				<FieldGroup className={styles["style-settings__controlls"]}>
					{keyValueList.map(
						(item: KeyValuePairType, index: number) => (
							<StylingItem
								key={item.id}
								item={item}
								onIdChange={(value: number) =>
									handleIdChange(value, index)
								}
								onLabelChange={(value: string) =>
									handleLabelChange(value, index)
								}
								onValueChange={(value: string) =>
									handleValueChange(value, index)
								}
								onAllowIconsChange={(value: boolean) =>
									handleAllowIconsChange(value, index)
								}
								onDelete={() => deleteItem(index)}
								duplicateArrays={duplicateArrays()}
								isRequired={true}
							/>
						),
					)}
				</FieldGroup>

				<FieldGroup className={styles["style-settings__buttons"]}>
					<Button
						fullWidth
						buttonType="muted"
						leftIcon={
							<span
								style={{
									display: "inline-flex",
									alignItems: "center",
								}}
							>
								<Plus
									size={16}
									strokeWidth={2}
									style={{ fill: "none" }}
								/>
							</span>
						}
						disabled={containsDuplicates()}
						onClick={handleAddItem}
					>
						Add item
					</Button>
					<Button
						fullWidth
						type="submit"
						buttonType="primary"
						className={styles["style-settings__submit"]}
					>
						Save styling settings
					</Button>
				</FieldGroup>

				{containsDuplicates() && (
					<FieldGroup className={styles["style-settings__warinig"]}>
						<p className={styles["style-settings__error"]}>
							All keys need to be unique. Saving this can result
							in data loss.
						</p>
					</FieldGroup>
				)}
			</Form>
		</div>
	);
};

export default StylingSettings;
