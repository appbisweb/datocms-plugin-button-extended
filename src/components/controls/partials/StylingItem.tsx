import { Button, TextField, FieldGroup, SwitchField } from "datocms-react-ui";
import { Trash2 } from "lucide-react";
import styles from "./../../../styles/styles.StylingSettings.module.css";

type ItemType = {
	id: number;
	label: string;
	value: string;
	allowIcons: boolean;
};
type Props = {
	item: ItemType;
	onIdChange: (value: number) => void;
	onLabelChange: (value: string) => void;
	onValueChange: (value: string) => void;
	onAllowIconsChange: (value: boolean) => void;
	onDelete: (value: number) => void;
	duplicateArrays: {
		duplicateIds: number[];
		duplicateLabels: string[];
		duplicateValues: string[];
	};
	isRequired: boolean;
};

export default function StylingItem({
	item,
	onIdChange,
	onLabelChange,
	onValueChange,
	onAllowIconsChange,
	onDelete,
	duplicateArrays,
	isRequired,
}: Props) {
	const { duplicateIds, duplicateLabels, duplicateValues } = duplicateArrays;
	const existingId = duplicateIds.includes(item.id);
	const existingLabel = duplicateLabels.includes(item.label);
	const existingValue = duplicateValues.includes(item.value);

	if (existingId) {
		const newId = item.id * 1000000;
		onIdChange(newId);
	}

	return (
		<div className={styles["style-settings__controll-item"]}>
			<FieldGroup className={styles["style-settings__controll-texts"]}>
				<TextField
					required={isRequired}
					error={
						(isRequired && item.label === "") || existingLabel
							? "Label already exists"
							: ""
					}
					name={`${item.id}-label`}
					id={`${item.id}-label`}
					label="Label"
					placeholder="Label"
					value={item.label}
					onChange={onLabelChange}
					formLabelProps={{
						children: <></>,
						htmlFor: `${item.id}-label`,
						className: "sr-only",
					}}
				/>
				<TextField
					required={isRequired}
					error={
						(isRequired && item.value === "") || existingValue
							? "Value is required"
							: ""
					}
					name={`${item.id}-value`}
					id={`${item.id}-value`}
					label="Value"
					placeholder="Value"
					value={item.value}
					onChange={onValueChange}
					formLabelProps={{
						children: <></>,
						htmlFor: `${item.id}-value`,
						className: "sr-only",
					}}
				/>
			</FieldGroup>

			<SwitchField
				id={`${item.id}-allowIcons`}
				name={`${item.id}-allowIcons`}
				label="Icons"
				value={item.allowIcons}
				onChange={onAllowIconsChange}
			/>

			<Button
				buttonSize="xs"
				buttonType="negative"
				leftIcon={
					<span
						style={{ display: "inline-flex", alignItems: "center" }}
					>
						<Trash2
							size={14}
							strokeWidth={2}
							style={{ fill: "none" }}
						/>
					</span>
				}
				onClick={() => onDelete(item.id)}
			>
				Delete
			</Button>
		</div>
	);
}
