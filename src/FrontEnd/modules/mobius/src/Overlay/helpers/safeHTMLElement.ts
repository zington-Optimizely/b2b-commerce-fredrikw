import ExecutionEnvironment from "exenv";

export const EE = ExecutionEnvironment;

const SafeHTMLElement = EE?.canUseDOM ? window.HTMLElement : {};

export const { canUseDOM = false } = EE;

export default SafeHTMLElement;
