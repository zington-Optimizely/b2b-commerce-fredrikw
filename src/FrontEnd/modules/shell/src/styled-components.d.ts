import { ShellTheme } from "@insite/shell/ShellTheme";
import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme extends ShellTheme {
  }
}
