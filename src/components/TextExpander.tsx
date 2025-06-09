import { useState } from "react";

/**
 * A component that truncates long text and allows users to expand/collapse it.
 *
 * @param children      The text content to display and expand/collapse.
 * @param visibleWords  Number of words to show before truncation (default: 10).
 * @param expandLabel   Label for the expand button (default: "See more").
 * @param collapseLabel Label for the collapse button (default: "See less").
 * @param containerClass Optional CSS class for the outer container.
 * @param defaultOpen   If true, the text is expanded by default (default: false).
 * @param textColor     Optional color for the text.
 * @param buttonClass   Optional CSS class for the expand/collapse button.
 */
interface TextExpanderProps {
    /** The text content to display and expand/collapse */
    children: string ;
    /** Number of words to show before truncation (default: 10) */
    visibleWords?: number;
    /** Label for the expand button (default: "See more") */
    expandLabel?: string;
    /** Label for the collapse button (default: "See less") */
    collapseLabel?: string;
    /** Optional CSS class for the outer container */
    containerClass?: string;
    /** If true, the text is expanded by default (default: false) */
    defaultOpen?: boolean;
    /** Optional color for the text */
    textColor?: string;
    /** Optional CSS class for the expand/collapse button */
    buttonClass?: string;
}

const TextExpander = ({ children="🚨**DID YOU FORGET TO ADD TEXT?**🚨", visibleWords = 10, expandLabel = "See more", collapseLabel = "See less", buttonClass = "", containerClass = "", defaultOpen = false }: TextExpanderProps) => {
    const [isExpanded, setIsExpanded] = useState(defaultOpen);


    const sliceWords = (text: string) => {
        if (isExpandable(text)) {
            return text.split(' ').slice(0, visibleWords).join(" ") + " . . . ";
        }

        console.warn("Number of words is less than or equal to visibleWords");
        return text;
    }

    const isExpandable = (text: string) => {
        const words = text.split(/[ ]+/g);
        if (words.length > visibleWords) {
            return true;
        }
    }

    const expandHandler = () => {
        setIsExpanded(!isExpanded);
    };
    return (
        <div className={containerClass}>
            {isExpanded ? children : sliceWords(children)} 
            {isExpandable(children) && <u style={{cursor: "pointer"}} className={buttonClass} onClick={expandHandler}>{isExpanded ? collapseLabel : expandLabel}</u>}
        </div>
    );
}

export default TextExpander;