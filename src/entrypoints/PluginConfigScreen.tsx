import { useState } from "react";
import { Canvas, Section } from "datocms-react-ui";

import LinkSettings from "../components/controls/LinkSettings";
import StylingSettings from "../components/controls/StylingSettings";
import IconSettings from "../components/controls/IconSettings";

type Props = {
	ctx: any;
};

export default function PluginConfigScreen({ ctx }: Props) {
	const [linkSettingIsOpen, setLinkSettingIsOpen] = useState(true);
	const [stylingSettingIsOpen, setStylingSettingIsOpen] = useState(true);
	const [iconSettingIsOpen, setIconSettingIsOpen] = useState(true);

	return (
		<Canvas ctx={ctx}>
			<div className="content">
				<p>Welcome to the "Button Extended" plugin!</p>
				<p>
					This DatoCMS plugin allows you to easily create a complex
					link field, containing:
				</p>
				<ul>
					<li>
						Different link types (records, assets, URLs, email
						links, or telephone numbers)
					</li>
					<li>Custom styling variants</li>
					<li>Icon selection per variant</li>
					<li>Custom title overrides</li>
					<li>Aria-label text overrides</li>
					<li>Target window and NoFollow controls</li>
				</ul>
			</div>

			<div>
				<h2>Installation</h2>
				<ol>
					<li>Install the plugin.</li>
					<li>
						Go to the plugin and fill in the{" "}
						<strong>"Link Settings"</strong>,{" "}
						<strong>"Styling Settings"</strong> and{" "}
						<strong>"Icon Settings"</strong>. These values will be
						your default link field values.
					</li>
					<li>Create a new JSON field.</li>
					<li>
						Fill in your preferred name, fieldId, and localization
						(leave all other fields empty for now).
					</li>
					<li>
						Go to <strong>"Presentation"</strong> and choose the{" "}
						<strong>"Button Extended"</strong> appearance.
					</li>
					<li>
						Optionally, go to the <strong>"Link Settings"</strong>,{" "}
						<strong>"Styling Settings"</strong> and{" "}
						<strong>"Icon Settings"</strong> to override the default
						values.
					</li>
					<li>Save the settings and the field.</li>
					<li>
						You can now add this field to your site and start using
						it.
					</li>
				</ol>
			</div>

			<div>
				<h2>How it works</h2>
				<p>
					After installing the plugin and creating a new field (see
					installation instructions), you can start using the new
					"Button Extended" field. It allows you to set default
					settings in the plugin window and customize those settings
					for each field in the field appearance window. The settings
					of the plugin, field, and its content will be saved as a
					JSON object.
				</p>
				<p>
					The JSON data will be hidden in the CMS/frontend and will be
					replaced with a user-friendly UI, which helps the user to
					easily create a link with customized data, giving them more
					control over their links.
				</p>
			</div>

			<div>
				<h2>Development</h2>
				<p>
					When using the plugin, a JSON data object will be generated
					with all the settings and filled-in content. This data will
					be hidden in the CMS/frontend but is accessible using
					GraphQL and the CDA Playground.
				</p>
				<p>
					When querying the data of a{" "}
					<strong>"Button Extended"</strong> field, the whole JSON
					data object will be returned, containing all the data and
					selected options, allowing developers full access to the
					detailed information of the link.
				</p>
				<p>
					This might look a bit intimidating at first glance, but
					don't be scared. In the JSON data object, you will also find
					an object called "formatted". This object contains a
					minimized representation of all link data. In most cases,
					this data will be more than enough to handle your links.
				</p>
			</div>

			<div>
				<h2>Settings</h2>
				<Section
					title="Link setting"
					collapsible={{
						isOpen: linkSettingIsOpen,
						onToggle: () => setLinkSettingIsOpen((prev) => !prev),
					}}
				>
					<LinkSettings ctx={ctx} configType="plugin_settings" />
				</Section>
				<Section
					title="Styling settings"
					collapsible={{
						isOpen: stylingSettingIsOpen,
						onToggle: () =>
							setStylingSettingIsOpen((prev) => !prev),
					}}
				>
					<StylingSettings ctx={ctx} configType="plugin_settings" />
				</Section>
				<Section
					title="Icon settings"
					collapsible={{
						isOpen: iconSettingIsOpen,
						onToggle: () => setIconSettingIsOpen((prev) => !prev),
					}}
				>
					<IconSettings ctx={ctx} configType="plugin_settings" />
				</Section>
			</div>
		</Canvas>
	);
}
