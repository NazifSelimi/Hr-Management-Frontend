import type { ButtonProps } from "antd/es/button";
import type { FC } from "react";

import { Button } from "antd";

interface ButtonComponentProps extends ButtonProps {}

const ButtonComponent: FC<ButtonComponentProps> = (props) => {
  return <Button {...props} />;
};

export default ButtonComponent;
