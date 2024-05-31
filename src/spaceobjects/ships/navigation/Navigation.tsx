import { Patrol } from "./Patrol"
import { Controlled } from './Controlled'
import  { NavigationNames, NavigationProps } from "./types"
import { Hunting } from "./Hunting"

interface Props {
    type: NavigationNames
    props: NavigationProps[Props["type"]]
}

const isNavigationType = <T extends keyof NavigationProps>(type: T, props: any): props is NavigationProps[T] => {
    if (type === "patrol") {
        return (props as NavigationProps["patrol"]).origin !== undefined;
    } else if (type === "user") {
        return (props as NavigationProps["user"]).isSelected !== undefined;
    }
    else if(type === "harvest")
        return (props as NavigationProps["harvest"]).isSelected !== undefined
    else if(type === "hunting")
        return (props as NavigationProps["hunting"]).origin !== undefined
    return false;
};

export const Navigation = ({ type, props }: Props) => {
    if (type === "patrol" && isNavigationType(type, props)) {
        return <Patrol {...props} />;
    }
    else if (type === "user" && isNavigationType(type, props)) {
        return <Controlled {...props} />;
    }
    else if(type === "harvest" && isNavigationType(type, props)) {
        return <Controlled {...props} />
    }
    else if (type === "hunting" && isNavigationType(type, props)) {
        return <Hunting {...props} />
    }
    return null;
};