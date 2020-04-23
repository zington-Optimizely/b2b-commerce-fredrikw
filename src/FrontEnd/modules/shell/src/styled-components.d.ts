import "styled-components";
import { ShellTheme } from "@insite/shell/ShellTheme";

declare module "styled-components" {
  export interface DefaultTheme extends ShellTheme {
  }
}
