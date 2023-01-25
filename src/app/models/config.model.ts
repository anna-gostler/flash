import { IconDefinition } from "@fortawesome/free-solid-svg-icons";

export interface ButtonConfig {
    id: string;
    callback: () => void;
    label?: string;
    icon?: IconDefinition;
    disabled?: boolean;
    main?: boolean;
    hide?: boolean;
}