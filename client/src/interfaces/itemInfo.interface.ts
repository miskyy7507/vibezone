export interface TextFormItemOptions {
    // type: React.HTMLInputTypeAttribute;
    type: "text" | "password";
    placeholder?: string;
    autoComplete?: React.HTMLInputAutoCompleteAttribute;
    tip?: string;
    required?: boolean;
    trim?: boolean;
}
