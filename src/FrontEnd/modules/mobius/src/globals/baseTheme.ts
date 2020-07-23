import { css } from "styled-components";
import { AccordionPresentationProps } from "../Accordion";
import { AccordionSectionPresentationProps } from "../AccordionSection";
import AccordionSectionPresentationPropsDefault from "../AccordionSection/presentationProps";
import { BreadcrumbsProps } from "../Breadcrumbs";
import BreadcrumbsPresentationPropsDefault from "../Breadcrumbs/presentationProps";
import { ButtonPresentationProps } from "../Button";
import ButtonPresentationPropsDefault from "../Button/presentationProps";
import { CheckboxPresentationProps } from "../Checkbox";
import CheckboxPresentationPropsDefault from "../Checkbox/presentationProps";
import { CheckboxGroupProps } from "../CheckboxGroup/CheckboxGroup";
import { ClickableProps } from "../Clickable";
import { DataTablePresentationProps } from "../DataTable";
import DataTablePresentationPropsDefault from "../DataTable/presentationProps";
import { DatePickerPresentationProps } from "../DatePicker";
import DatePickerPresentationPropsDefault from "../DatePicker/presentationProps";
import { DrawerPresentationProps } from "../Drawer";
import DrawerPresentationPropsDefault from "../Drawer/presentationProps";
import { DynamicDropdownPresentationProps } from "../DynamicDropdown";
import DynamicDropdownPresentationPropsDefault from "../DynamicDropdown/presentationProps";
import { FileUploadPresentationProps } from "../FileUpload";
import FileUploadPresentationPropsDefault from "../FileUpload/presentationProps";
import { FormFieldPresentationProps, FormFieldPropsMock } from "../FormField";
import { IconThemableProps } from "../Icon";
import IconPresentationPropsDefault from "../Icon/presentationProps";
import { LazyImagePresentationProps } from "../LazyImage";
import LazyImagePresentationPropsDefault from "../LazyImage/presentationProps";
import { LinkPresentationProps } from "../Link";
import LinkPresentationPropsDefault from "../Link/presentationProps";
import { LoadingSpinnerProps } from "../LoadingSpinner";
import { MenuPresentationProps } from "../Menu";
import MenuDefaultProps from "../Menu/presentationProps";
import { ModalPresentationProps } from "../Modal";
import ModalPresentationPropsDefault from "../Modal/presentationProps";
import { OverflowMenuPresentationProps } from "../OverflowMenu";
import OverflowMenuPresentationPropsDefault from "../OverflowMenu/presentationProps";
import { PaginationPresentationProps } from "../Pagination";
import PaginationPresentationPropsDefault from "../Pagination/presentationProps";
import { PanelMenuPresentationProps } from "../PanelMenu";
import PanelMenuDefaultProps from "../PanelMenu/presentationProps";
import { RadioProps } from "../Radio";
import { RadioGroupProps } from "../RadioGroup";
import { SelectPresentationProps, SelectProps } from "../Select";
import SelectPresentationPropsDefault from "../Select/presentationProps";
import { TabPresentationProps } from "../Tab";
import { TabGroupPresentationProps } from "../TabGroup";
import { TagPresentationProps } from "../Tag";
import TagPresentationPropsDefault from "../Tag/presentationProps";
import { TextAreaProps } from "../TextArea";
import { TextFieldPresentationProps } from "../TextField";
import { ToastPresentationProps } from "../Toast";
import ToastPropsDefault, { toasterProps as toasterPropsDefault } from "../Toast/presentationProps";
import { ToasterPresentationProps } from "../Toast/Toaster";
import { TokenExFramePresentationProps } from "../TokenExFrame";
import { TooltipPresentationProps } from "../Tooltip";
import TooltipPropsDefault from "../Tooltip/presentationProps";
import { TypographyPresentationProps } from "../Typography";
import FieldSetPresentationProps, {
    FieldSetGroupPresentationProps,
    FieldSetPropsMock,
} from "../utilities/fieldSetProps";
import InjectableCss, { StyledProp } from "../utilities/InjectableCss";

export interface ThemeBreakpoints {
    keys: string[];
    values: number[];
    maxWidths: number[];
}

export interface ThemeColor {
    main: string;
    contrast: string;
}

export interface ThemeCommon {
    background: string;
    backgroundContrast: string;
    accent: string;
    accentContrast: string;
    border: string;
    disabled: string;
}

export interface ThemeText {
    main: string;
    disabled: string;
    accent: string;
    link: string;
}

export interface ThemeColors {
    primary: ThemeColor;
    secondary: ThemeColor;
    common: ThemeCommon;
    text: ThemeText;
    success: ThemeColor;
    danger: ThemeColor;
    warning: ThemeColor;
    info: ThemeColor;
}

export interface ThemeFocus {
    color: string;
    style: string;
    width: string;
}

export interface ThemeTransitionDuration {
    short: number;
    regular: number;
    long: number;
}

export interface ThemeTransition {
    duration: ThemeTransitionDuration;
}

export interface ThemeTypography {
    body: TypographyPresentationProps;
    p: TypographyPresentationProps;
    h1: TypographyPresentationProps;
    h2: TypographyPresentationProps;
    h3: TypographyPresentationProps;
    h4: TypographyPresentationProps;
    h5: TypographyPresentationProps;
    h6: TypographyPresentationProps;
    headerPrimary: TypographyPresentationProps;
    headerSecondary: TypographyPresentationProps;
    headerTertiary: TypographyPresentationProps;
    legend: TypographyPresentationProps;
}

export interface ZIndex {
    popover: number;
    datePicker: number;
    dynamicDropdown: number;
    stickyFooter: number;
    loadingOverlay: number;
    menu: number;
    drawer: number;
    modal: number;
    tabGroup: number;
    toaster: number;
}

export interface BreadcrumbsPresentationProps {
    defaultProps?: {
        css?: StyledProp<BreadcrumbsProps>;
        typographyProps?: TypographyPresentationProps;
    };
}

export interface ComponentThemeProps {
    accordion: {
        defaultProps?: AccordionPresentationProps;
        sectionDefaultProps?: AccordionSectionPresentationProps;
    };
    breadcrumbs: BreadcrumbsPresentationProps;
    button: {
        defaultProps?: ButtonPresentationProps;
        primary: ButtonPresentationProps;
        secondary: ButtonPresentationProps;
        tertiary: ButtonPresentationProps;
    };
    checkbox: {
        defaultProps?: CheckboxPresentationProps;
        groupDefaultProps?: FieldSetGroupPresentationProps<CheckboxGroupProps>;
    };
    clickable: { defaultProps?: { css?: StyledProp<ClickableProps>; } };
    dataTable: { defaultProps?: DataTablePresentationProps; };
    datePicker: { defaultProps?: DatePickerPresentationProps };
    drawer: { defaultProps?: DrawerPresentationProps };
    dynamicDropdown: { defaultProps?: DynamicDropdownPresentationProps };
    fileUpload: { defaultProps?: FileUploadPresentationProps; };
    icon: { defaultProps?: IconThemableProps; };
    link: { defaultProps?: LinkPresentationProps };
    lazyImage: { defaultProps?: LazyImagePresentationProps };
    loadingSpinner: { defaultProps?: LoadingSpinnerProps };
    menu: { defaultProps?: MenuPresentationProps };
    modal: {
        sizeVariants: {
            small: number;
            medium: number;
            large: number;
        };
        defaultProps?: ModalPresentationProps
    };
    overflowMenu: { defaultProps?: OverflowMenuPresentationProps };
    pagination: { defaultProps?: PaginationPresentationProps };
    panelMenu: { defaultProps?: PanelMenuPresentationProps };
    radio: {
        defaultProps?: FieldSetPresentationProps<RadioProps>;
        groupDefaultProps?: FieldSetGroupPresentationProps<RadioGroupProps>;
    };
    select: { defaultProps?: FormFieldPresentationProps<SelectProps> & SelectPresentationProps; };
    tab: {
        defaultProps?: TabPresentationProps
        groupDefaultProps?: TabGroupPresentationProps;
    };
    tag: { defaultProps?: TagPresentationProps };
    textField: { defaultProps?: TextFieldPresentationProps; };
    tokenExFrame: { defaultProps?: TokenExFramePresentationProps; };
    textArea: { defaultProps?: FormFieldPresentationProps<TextAreaProps>; };
    toast: {
        defaultProps?: ToastPresentationProps,
        toasterProps?: ToasterPresentationProps,
    };
    tooltip: { defaultProps?: TooltipPresentationProps };
}

export interface CategoryThemeProps {
    formField: { defaultProps?: FormFieldPresentationProps<FormFieldPropsMock>; };
    fieldSet: {
        defaultProps?: FieldSetPresentationProps<FieldSetPropsMock>;
        groupDefaultProps?: FieldSetGroupPresentationProps;
    };
}

export interface BaseTheme extends ComponentThemeProps, CategoryThemeProps {
    breakpoints: ThemeBreakpoints;
    colors: ThemeColors;
    focus: ThemeFocus;
    shadows: {
        1: string;
        2: string;
        3: string;
    };
    transition: ThemeTransition;
    globalStyle: InjectableCss;
    typography: ThemeTypography & {
        fontFamilyImportUrl: string;
    };
    zIndex: ZIndex;
    translate: (text: string) => string;
}

const baseTheme: BaseTheme = {
    breakpoints: {
        keys: ["xs", "sm", "md", "lg", "xl"],
        values: [0, 576, 768, 992, 1200],
        maxWidths: [540, 540, 720, 960, 1140],
    },
    colors: {
        primary: {
            main: "#275AA8",
            contrast: "#FFFFFF",
        },
        secondary: {
            main: "#6C757D",
            contrast: "#FFFFFF",
        },
        common: {
            background: "#FFFFFF",
            backgroundContrast: "#363636",
            accent: "#F8F9FA",
            accentContrast: "#363636",
            border: "#CCCCCC",
            disabled: "#CCCCCC",
        },
        text: {
            main: "#0F0F0F",
            disabled: "#475353",
            accent: "#2D3435",
            link: "#2E64B0",
        },
        success: {
            main: "#27A74A",
            contrast: "#FFFFFF",
        },
        danger: {
            main: "#E64E25",
            contrast: "#FFFFFF",
        },
        warning: {
            main: "#FEC111",
            contrast: "#FFFFFF",
        },
        info: {
            main: "#13A2B9",
            contrast: "#FFFFFF",
        },
    },
    focus: {
        color: "#09f",
        style: "solid",
        width: "2px",
    },
    shadows: {
        1: "0px 1px 5px 0px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 3px 1px -2px rgba(0,0,0,0.12)",
        2: "0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)",
        3: "0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)",
    },
    transition: {
        duration: {
            short: 100,
            regular: 200,
            long: 500,
        },
    },
    globalStyle: {},
    typography: {
        fontFamilyImportUrl: "https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700,800&display=swap",
        body: {
            size: "15px",
            weight: 400,
            fontFamily: "'Open Sans', 'Roboto', 'Lato', sans-serif",
        },
        p: {
            size: "15px",
            weight: 400,
            css: css`
                margin-bottom: 1rem;
                display: block;
            `,
        },
        h1: {
            size: "40px",
            weight: 700,
            css: css`
                margin-bottom: 1rem;
                display: block;
            `,
        },
        h2: {
            size: "32px",
            weight: 700,
            css: css`
                margin-bottom: 1rem;
                display: block;
            `,
        },
        h3: {
            size: "28px",
            weight: 700,
            css: css`
                margin-bottom: 1rem;
                display: block;
            `,
        },
        h4: {
            size: "24px",
            weight: 700,
            css: css`
                margin-bottom: 1rem;
                display: block;
            `,
        },
        h5: {
            size: "20px",
            weight: 700,
            css: css`
                margin-bottom: 1rem;
                display: block;
            `,
        },
        h6: {
            size: "16px",
            weight: 700,
            css: css`
                margin-bottom: 1rem;
                display: block;
            `,
        },
        headerPrimary: {
            forwardAs: "p",
            size: "24px",
            fontFamily: "'Open Sans SemiBold', 'Roboto', 'Lato', sans-serif",
            color: "text.main",
            transform: "uppercase",
        },
        headerSecondary: {
            forwardAs: "p",
            size: "15px",
            fontFamily: "'Open Sans SemiBold', 'Roboto', 'Lato', sans-serif",
            transform: "uppercase",
            weight: 800,
        },
        headerTertiary: {
            forwardAs: "p",
            size: "15px",
            fontFamily: "'Open Sans SemiBold', 'Roboto', 'Lato', sans-serif",
            color: "text.main",
            transform: "uppercase",
        },
        legend: {
            forwardAs: "span",
            size: "10px",
            color: "text.accent",
            transform: "uppercase",
            weight: 600,
        },
    },
    zIndex: {
        popover: 1260,
        datePicker: 1270,
        dynamicDropdown: 1280,
        stickyFooter: 1284,
        loadingOverlay: 1285,
        menu: 1290,
        drawer: 1290,
        modal: 1300,
        tabGroup: 400,
        toaster: 1400,
    },
    accordion: {
        defaultProps: {},
        sectionDefaultProps: AccordionSectionPresentationPropsDefault,
    },
    breadcrumbs: { defaultProps: BreadcrumbsPresentationPropsDefault },
    button: {
        primary: {
            ...ButtonPresentationPropsDefault,
            color: "primary",
            buttonType: "solid",
        },
        secondary: {
            ...ButtonPresentationPropsDefault,
            color: "secondary",
            buttonType: "outline",
        },
        tertiary: {
            ...ButtonPresentationPropsDefault,
            color: "secondary",
            buttonType: "solid",
        },
    },
    checkbox: { defaultProps: CheckboxPresentationPropsDefault, groupDefaultProps: {} },
    clickable: { defaultProps: {} },
    dataTable: { defaultProps: DataTablePresentationPropsDefault },
    datePicker: { defaultProps: DatePickerPresentationPropsDefault },
    drawer: { defaultProps: DrawerPresentationPropsDefault },
    dynamicDropdown: { defaultProps: DynamicDropdownPresentationPropsDefault },
    fileUpload: { defaultProps: FileUploadPresentationPropsDefault },
    formField: {
        defaultProps: {
            border: "rectangle",
            sizeVariant: "default",
        },
    },
    fieldSet: {
        defaultProps: {
            color: "primary",
            typographyProps: {},
        },
        groupDefaultProps: {
            sizeVariant: "default",
        },
    },
    icon: { defaultProps: IconPresentationPropsDefault },
    link: { defaultProps: LinkPresentationPropsDefault },
    lazyImage: { defaultProps: LazyImagePresentationPropsDefault },
    loadingSpinner: { defaultProps: {} },
    menu: { defaultProps: MenuDefaultProps },
    modal: {
        sizeVariants: {
            small: 500,
            medium: 800,
            large: 1110,
        },
        defaultProps: ModalPresentationPropsDefault,
    },
    overflowMenu: { defaultProps: OverflowMenuPresentationPropsDefault },
    pagination: { defaultProps: PaginationPresentationPropsDefault },
    panelMenu: { defaultProps: PanelMenuDefaultProps },
    radio: { defaultProps: {}, groupDefaultProps: {} },
    select: { defaultProps: SelectPresentationPropsDefault },
    tab: {
        defaultProps: {},
        groupDefaultProps: {},
    },
    tag: { defaultProps: TagPresentationPropsDefault },
    textField: { defaultProps: {} },
    tokenExFrame: { defaultProps: {} },
    textArea: { defaultProps: {} },
    toast: { defaultProps: ToastPropsDefault, toasterProps: toasterPropsDefault },
    tooltip: { defaultProps: TooltipPropsDefault },
    translate: () => { throw new Error("Attempted to translate without a configured translator."); },
};

export default baseTheme;
