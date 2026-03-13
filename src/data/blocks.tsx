import { type ReactElement } from "react";
import { Block } from "@/components/templates";
import { StackLayout, SplitLayout } from "@/components/layouts";
import {
    EditableH1,
    EditableH2,
    EditableH3,
    EditableParagraph,
    InlineScrubbleNumber,
    InlineClozeInput,
    InlineClozeChoice,
    InlineFeedback,
    InlineLinkedHighlight,
    InteractionHintSequence,
} from "@/components/atoms";
import { FormulaBlock } from "@/components/molecules";
import { Cartesian2D } from "@/components/atoms/visual/Cartesian2D";
import { useVar, useSetVar } from "@/stores";

// Initialize variables and their colors from this file's variable definitions
import { useVariableStore, initializeVariableColors } from "@/stores";
import { getDefaultValues, variableDefinitions, getVariableInfo, numberPropsFromDefinition, scrubVarsFromDefinitions } from "./variables";
useVariableStore.getState().initialize(getDefaultValues());
initializeVariableColors(variableDefinitions);

// ============================================================================
// REACTIVE VISUALIZATION COMPONENTS
// ============================================================================

/** Direct Proportion Visualization - Interactive line chart showing y = kx */
function DirectProportionChart() {
    const k = useVar('directConstantK', 2) as number;
    const x = useVar('directX', 3) as number;
    const setVar = useSetVar();

    const y = k * x;

    return (
        <div className="relative">
            <Cartesian2D
                height={350}
                viewBox={{ x: [-1, 12], y: [-1, 25] }}
                plots={[
                    {
                        type: "function",
                        fn: (xVal) => k * xVal,
                        color: "#62D0AD",
                        weight: 3,
                        domain: [0, 12],
                        highlightId: "directLine",
                    },
                    {
                        type: "segment",
                        point1: [x, 0],
                        point2: [x, y],
                        color: "#8E90F5",
                        style: "dashed",
                        weight: 2,
                    },
                    {
                        type: "segment",
                        point1: [0, y],
                        point2: [x, y],
                        color: "#8E90F5",
                        style: "dashed",
                        weight: 2,
                    },
                ]}
                movablePoints={[
                    {
                        initial: [x, y],
                        color: "#62D0AD",
                        constrain: (point: [number, number]): [number, number] => {
                            // Constrain to the line y = kx
                            const newX = Math.max(0, Math.min(10, point[0]));
                            return [newX, k * newX];
                        },
                        onChange: (point: [number, number]) => {
                            setVar('directX', Math.round(point[0]));
                        },
                        position: [x, y],
                    },
                ]}
                highlightVarName="directHighlight"
            />
            <InteractionHintSequence
                hintKey="direct-proportion-chart"
                steps={[
                    {
                        gesture: "drag",
                        label: "Drag the point along the line to see x and y change",
                        position: { x: "55%", y: "35%" },
                        dragPath: {
                            type: "line",
                            startOffset: { x: 0, y: 0 },
                            endOffset: { x: 40, y: -20 },
                        },
                    },
                ]}
                color="#62D0AD"
            />
        </div>
    );
}

/** Inverse Proportion Visualization - Interactive curve chart showing y = k/x */
function InverseProportionChart() {
    const k = useVar('inverseConstantK', 12) as number;
    const x = useVar('inverseX', 3) as number;
    const setVar = useSetVar();

    const y = k / x;

    return (
        <div className="relative">
            <Cartesian2D
                height={350}
                viewBox={{ x: [-1, 12], y: [-1, 15] }}
                plots={[
                    {
                        type: "function",
                        fn: (xVal) => xVal > 0.3 ? k / xVal : NaN,
                        color: "#F7B23B",
                        weight: 3,
                        domain: [0.3, 12],
                        highlightId: "inverseCurve",
                    },
                    {
                        type: "segment",
                        point1: [x, 0],
                        point2: [x, y],
                        color: "#AC8BF9",
                        style: "dashed",
                        weight: 2,
                    },
                    {
                        type: "segment",
                        point1: [0, y],
                        point2: [x, y],
                        color: "#AC8BF9",
                        style: "dashed",
                        weight: 2,
                    },
                ]}
                movablePoints={[
                    {
                        initial: [x, y],
                        color: "#F7B23B",
                        constrain: (point: [number, number]): [number, number] => {
                            // Constrain to the curve y = k/x
                            const newX = Math.max(1, Math.min(10, point[0]));
                            return [newX, k / newX];
                        },
                        onChange: (point: [number, number]) => {
                            setVar('inverseX', Math.round(point[0]));
                        },
                        position: [x, y],
                    },
                ]}
                highlightVarName="inverseHighlight"
            />
            <InteractionHintSequence
                hintKey="inverse-proportion-chart"
                steps={[
                    {
                        gesture: "drag",
                        label: "Drag the point along the curve to explore the relationship",
                        position: { x: "45%", y: "40%" },
                        dragPath: {
                            type: "arc",
                            startAngle: -30,
                            endAngle: 30,
                            radius: 35,
                        },
                    },
                ]}
                color="#F7B23B"
            />
        </div>
    );
}

/** Comparison Visualization - Side by side direct and inverse */
function ComparisonChart() {
    const k = useVar('comparisonK', 6) as number;

    return (
        <div className="relative">
            <Cartesian2D
                height={350}
                viewBox={{ x: [-1, 10], y: [-1, 14] }}
                plots={[
                    {
                        type: "function",
                        fn: (xVal) => k * xVal / 5,
                        color: "#62D0AD",
                        weight: 3,
                        domain: [0, 10],
                        highlightId: "comparisonDirect",
                    },
                    {
                        type: "function",
                        fn: (xVal) => xVal > 0.5 ? k / xVal : NaN,
                        color: "#F7B23B",
                        weight: 3,
                        domain: [0.5, 10],
                        highlightId: "comparisonInverse",
                    },
                ]}
            />
            <InteractionHintSequence
                hintKey="comparison-chart"
                steps={[
                    {
                        gesture: "hover",
                        label: "Hover over the lines to see which is which",
                        position: { x: "50%", y: "40%" },
                    },
                ]}
                color="#62CCF9"
            />
        </div>
    );
}

// ============================================================================
// LESSON BLOCKS
// ============================================================================

export const blocks: ReactElement[] = [
    // ========================================================================
    // SECTION 1: INTRODUCTION
    // ========================================================================
    <StackLayout key="layout-intro-title" maxWidth="xl">
        <Block id="intro-title" padding="lg">
            <EditableH1 id="h1-intro-title" blockId="intro-title">
                Direct and Inverse Proportions
            </EditableH1>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-intro-hook" maxWidth="xl">
        <Block id="intro-hook" padding="sm">
            <EditableParagraph id="para-intro-hook" blockId="intro-hook">
                Imagine you are painting a fence. The more painters you hire, the faster the job gets done. But here is something curious: if 2 painters take 6 hours, do 4 painters take 12 hours? Actually, no! They take only 3 hours. Some quantities grow together, while others work in opposition. This is the fascinating world of proportions.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-intro-overview" maxWidth="xl">
        <Block id="intro-overview" padding="sm">
            <EditableParagraph id="para-intro-overview" blockId="intro-overview">
                In this lesson, we will explore two fundamental types of relationships: direct proportion, where quantities increase together, and inverse proportion, where one increases as the other decreases. By the end, you will be able to identify, calculate, and graph both types.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // ========================================================================
    // SECTION 2: DIRECT PROPORTION
    // ========================================================================
    <StackLayout key="layout-direct-heading" maxWidth="xl">
        <Block id="direct-heading" padding="md">
            <EditableH2 id="h2-direct-heading" blockId="direct-heading">
                Direct Proportion
            </EditableH2>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-direct-definition" maxWidth="xl">
        <Block id="direct-definition" padding="sm">
            <EditableParagraph id="para-direct-definition" blockId="direct-definition">
                When two quantities are in direct proportion, they change in the same direction. If one doubles, the other doubles. If one halves, the other halves. Think of buying apples: the more apples you buy, the more you pay. The relationship is always consistent, governed by a constant called <InlineLinkedHighlight varName="directHighlight" highlightId="directLine" color="#62D0AD">k</InlineLinkedHighlight>.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-direct-formula" maxWidth="xl">
        <Block id="direct-formula" padding="lg">
            <FormulaBlock
                latex="y = \clr{k}{k} \times \clr{x}{x}"
                colorMap={{
                    k: "#62D0AD",
                    x: "#8E90F5",
                }}
            />
        </Block>
    </StackLayout>,

    <StackLayout key="layout-direct-formula-explanation" maxWidth="xl">
        <Block id="direct-formula-explanation" padding="sm">
            <EditableParagraph id="para-direct-formula-explanation" blockId="direct-formula-explanation">
                Here, <InlineLinkedHighlight varName="directHighlight" highlightId="directLine" color="#62D0AD">k</InlineLinkedHighlight> is the constant of proportionality. It tells you how steep the relationship is. A larger k means y grows faster as x increases.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <SplitLayout key="layout-direct-interactive" ratio="1:1" gap="lg">
        <Block id="direct-interactive-text" padding="sm">
            <EditableParagraph id="para-direct-interactive-text" blockId="direct-interactive-text">
                In the chart on the right, you can see the <InlineLinkedHighlight varName="directHighlight" highlightId="directLine" color="#62D0AD">straight line</InlineLinkedHighlight> that represents direct proportion. Notice how it passes through the <InlineLinkedHighlight varName="directHighlight" highlightId="origin" color="#F7B23B">origin (0, 0)</InlineLinkedHighlight>. That is a key feature of direct proportion!
            </EditableParagraph>
            <div className="mt-4">
                <EditableParagraph id="para-direct-scrub-intro" blockId="direct-interactive-text">
                    When <InlineScrubbleNumber varName="directConstantK" {...numberPropsFromDefinition(getVariableInfo('directConstantK'))} /> × <InlineScrubbleNumber varName="directX" {...numberPropsFromDefinition(getVariableInfo('directX'))} />, the result y = <InlineScrubbleNumber varName="directX" {...numberPropsFromDefinition(getVariableInfo('directX'))} readonly /> × <InlineScrubbleNumber varName="directConstantK" {...numberPropsFromDefinition(getVariableInfo('directConstantK'))} readonly /> = {(() => {
                        const DirectYValue = () => {
                            const k = useVar('directConstantK', 2) as number;
                            const x = useVar('directX', 3) as number;
                            return <span className="font-semibold text-[#62D0AD]">{k * x}</span>;
                        };
                        return <DirectYValue />;
                    })()}
                </EditableParagraph>
            </div>
            <div className="mt-4">
                <EditableParagraph id="para-direct-drag-instruction" blockId="direct-interactive-text">
                    Drag the teal point along the line. Watch how the x and y values change together, but their ratio (y ÷ x) always equals k!
                </EditableParagraph>
            </div>
        </Block>
        <Block id="direct-chart" padding="sm" hasVisualization>
            <DirectProportionChart />
        </Block>
    </SplitLayout>,

    <StackLayout key="layout-direct-key-features" maxWidth="xl">
        <Block id="direct-key-features" padding="md">
            <EditableH3 id="h3-direct-key-features" blockId="direct-key-features">
                Key Features of Direct Proportion
            </EditableH3>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-direct-features-list" maxWidth="xl">
        <Block id="direct-features-list" padding="sm">
            <EditableParagraph id="para-direct-features-list" blockId="direct-features-list">
                The graph is always a straight line passing through the origin. The ratio y/x is constant and equals k. When x = 0, y = 0. The larger k is, the steeper the line becomes.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Direct Proportion Assessment
    <StackLayout key="layout-direct-question" maxWidth="xl">
        <Block id="direct-question" padding="md">
            <EditableH3 id="h3-direct-question" blockId="direct-question">
                Check Your Understanding
            </EditableH3>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-direct-question-one" maxWidth="xl">
        <Block id="direct-question-one" padding="sm">
            <EditableParagraph id="para-direct-question-one" blockId="direct-question-one">
                If y = 4x, and x = 5, what is the value of y? <InlineFeedback
                    varName="answerDirectCalculation"
                    correctValue="20"
                    position="terminal"
                    successMessage="Excellent! When k = 4 and x = 5, y = 4 × 5 = 20"
                    failureMessage="Not quite."
                    hint="Multiply k by x: y = 4 × 5"
                    sectionLinks={[{ blockId: "direct-formula", label: "Review the formula" }]}
                >
                    <InlineClozeInput
                        varName="answerDirectCalculation"
                        correctAnswer="20"
                        placeholder="?"
                        color="#62D0AD"
                    />
                </InlineFeedback>
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // ========================================================================
    // SECTION 3: INVERSE PROPORTION
    // ========================================================================
    <StackLayout key="layout-inverse-heading" maxWidth="xl">
        <Block id="inverse-heading" padding="md">
            <EditableH2 id="h2-inverse-heading" blockId="inverse-heading">
                Inverse Proportion
            </EditableH2>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-inverse-definition" maxWidth="xl">
        <Block id="inverse-definition" padding="sm">
            <EditableParagraph id="para-inverse-definition" blockId="inverse-definition">
                Inverse proportion is the opposite! When two quantities are inversely proportional, one increases as the other decreases. Remember the painters? More painters means less time. The product of the two quantities stays constant.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-inverse-formula" maxWidth="xl">
        <Block id="inverse-formula" padding="lg">
            <FormulaBlock
                latex="y = \frac{\clr{k}{k}}{\clr{x}{x}}"
                colorMap={{
                    k: "#F7B23B",
                    x: "#AC8BF9",
                }}
            />
        </Block>
    </StackLayout>,

    <StackLayout key="layout-inverse-formula-explanation" maxWidth="xl">
        <Block id="inverse-formula-explanation" padding="sm">
            <EditableParagraph id="para-inverse-formula-explanation" blockId="inverse-formula-explanation">
                Here, <InlineLinkedHighlight varName="inverseHighlight" highlightId="inverseCurve" color="#F7B23B">k</InlineLinkedHighlight> is still the constant of proportionality, but now it represents the product x × y. As x gets larger, y must get smaller to keep the product equal to k.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <SplitLayout key="layout-inverse-interactive" ratio="1:1" gap="lg">
        <Block id="inverse-interactive-text" padding="sm">
            <EditableParagraph id="para-inverse-interactive-text" blockId="inverse-interactive-text">
                Notice how different this <InlineLinkedHighlight varName="inverseHighlight" highlightId="inverseCurve" color="#F7B23B">curved line</InlineLinkedHighlight> looks from the straight line of direct proportion! The graph never touches either axis but gets closer and closer as it extends.
            </EditableParagraph>
            <div className="mt-4">
                <EditableParagraph id="para-inverse-scrub-intro" blockId="inverse-interactive-text">
                    When k = <InlineScrubbleNumber varName="inverseConstantK" {...numberPropsFromDefinition(getVariableInfo('inverseConstantK'))} /> and x = <InlineScrubbleNumber varName="inverseX" {...numberPropsFromDefinition(getVariableInfo('inverseX'))} />, y = k ÷ x = {(() => {
                        const InverseYValue = () => {
                            const k = useVar('inverseConstantK', 12) as number;
                            const x = useVar('inverseX', 3) as number;
                            return <span className="font-semibold text-[#F7B23B]">{(k / x).toFixed(1)}</span>;
                        };
                        return <InverseYValue />;
                    })()}
                </EditableParagraph>
            </div>
            <div className="mt-4">
                <EditableParagraph id="para-inverse-drag-instruction" blockId="inverse-interactive-text">
                    Drag the amber point along the curve. As x increases, y decreases. But notice that x × y always equals k!
                </EditableParagraph>
            </div>
        </Block>
        <Block id="inverse-chart" padding="sm" hasVisualization>
            <InverseProportionChart />
        </Block>
    </SplitLayout>,

    <StackLayout key="layout-inverse-key-features" maxWidth="xl">
        <Block id="inverse-key-features" padding="md">
            <EditableH3 id="h3-inverse-key-features" blockId="inverse-key-features">
                Key Features of Inverse Proportion
            </EditableH3>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-inverse-features-list" maxWidth="xl">
        <Block id="inverse-features-list" padding="sm">
            <EditableParagraph id="para-inverse-features-list" blockId="inverse-features-list">
                The graph is a curved line called a hyperbola. The product x × y is constant and equals k. The graph never touches the x-axis or y-axis (these are called asymptotes). As one variable gets very large, the other approaches zero.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Inverse Proportion Assessment
    <StackLayout key="layout-inverse-question" maxWidth="xl">
        <Block id="inverse-question" padding="md">
            <EditableH3 id="h3-inverse-question" blockId="inverse-question">
                Check Your Understanding
            </EditableH3>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-inverse-question-one" maxWidth="xl">
        <Block id="inverse-question-one" padding="sm">
            <EditableParagraph id="para-inverse-question-one" blockId="inverse-question-one">
                If y = 12/x, and y = 4, what is the value of x? <InlineFeedback
                    varName="answerInverseCalculation"
                    correctValue="3"
                    position="terminal"
                    successMessage="Correct! Since y = k/x, we rearrange to get x = k/y = 12/4 = 3"
                    failureMessage="Not quite."
                    hint="Rearrange the formula: x = k ÷ y"
                    sectionLinks={[{ blockId: "inverse-formula", label: "Review the formula" }]}
                >
                    <InlineClozeInput
                        varName="answerInverseCalculation"
                        correctAnswer="3"
                        placeholder="?"
                        color="#F7B23B"
                    />
                </InlineFeedback>
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // ========================================================================
    // SECTION 4: COMPARING BOTH TYPES
    // ========================================================================
    <StackLayout key="layout-comparison-heading" maxWidth="xl">
        <Block id="comparison-heading" padding="md">
            <EditableH2 id="h2-comparison-heading" blockId="comparison-heading">
                Comparing Direct and Inverse Proportions
            </EditableH2>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-comparison-intro" maxWidth="xl">
        <Block id="comparison-intro" padding="sm">
            <EditableParagraph id="para-comparison-intro" blockId="comparison-intro">
                Let us put both types side by side. The key difference is in the shape of the graph and how the variables relate to each other.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <SplitLayout key="layout-comparison-interactive" ratio="1:1" gap="lg">
        <Block id="comparison-text" padding="sm">
            <EditableParagraph id="para-comparison-direct" blockId="comparison-text">
                <strong>Direct (teal line):</strong> A straight line through the origin. As x increases, y increases at a constant rate. The ratio y/x stays the same.
            </EditableParagraph>
            <div className="mt-4">
                <EditableParagraph id="para-comparison-inverse" blockId="comparison-text">
                    <strong>Inverse (amber curve):</strong> A curved hyperbola. As x increases, y decreases. The product x × y stays the same.
                </EditableParagraph>
            </div>
            <div className="mt-4">
                <EditableParagraph id="para-comparison-scrub" blockId="comparison-text">
                    Change the constant k = <InlineScrubbleNumber varName="comparisonK" {...numberPropsFromDefinition(getVariableInfo('comparisonK'))} /> and watch both graphs respond!
                </EditableParagraph>
            </div>
        </Block>
        <Block id="comparison-chart" padding="sm" hasVisualization>
            <ComparisonChart />
        </Block>
    </SplitLayout>,

    <StackLayout key="layout-comparison-table-heading" maxWidth="xl">
        <Block id="comparison-table-heading" padding="md">
            <EditableH3 id="h3-comparison-table-heading" blockId="comparison-table-heading">
                Quick Comparison
            </EditableH3>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-comparison-summary" maxWidth="xl">
        <Block id="comparison-summary" padding="sm">
            <EditableParagraph id="para-comparison-summary" blockId="comparison-summary">
                Direct proportion: y = kx, straight line through origin, y/x = k (constant ratio). Inverse proportion: y = k/x, curved hyperbola, x × y = k (constant product).
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // ========================================================================
    // SECTION 5: PRACTICE QUESTIONS
    // ========================================================================
    <StackLayout key="layout-practice-heading" maxWidth="xl">
        <Block id="practice-heading" padding="md">
            <EditableH2 id="h2-practice-heading" blockId="practice-heading">
                Practice Problems
            </EditableH2>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-practice-intro" maxWidth="xl">
        <Block id="practice-intro" padding="sm">
            <EditableParagraph id="para-practice-intro" blockId="practice-intro">
                Now it is your turn! Apply what you have learned to these real-world scenarios.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-practice-question-one" maxWidth="xl">
        <Block id="practice-question-one" padding="md">
            <EditableH3 id="h3-practice-question-one" blockId="practice-question-one">
                Question 1
            </EditableH3>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-practice-one-content" maxWidth="xl">
        <Block id="practice-one-content" padding="sm">
            <EditableParagraph id="para-practice-one-content" blockId="practice-one-content">
                A car travels at constant speed. The further it goes, the more petrol it uses. If using 10 litres gets you 150 km, this is an example of <InlineFeedback
                    varName="answerProportionTypeDirect"
                    correctValue="direct"
                    position="terminal"
                    successMessage="Correct! Distance and petrol used increase together"
                    failureMessage="Think again."
                    hint="When one quantity increases, does the other increase or decrease?"
                    sectionLinks={[{ blockId: "direct-definition", label: "Review direct proportion" }]}
                >
                    <InlineClozeChoice
                        varName="answerProportionTypeDirect"
                        correctAnswer="direct"
                        options={["direct", "inverse"]}
                        placeholder="???"
                        color="#62D0AD"
                    />
                </InlineFeedback> proportion.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-practice-question-two" maxWidth="xl">
        <Block id="practice-question-two" padding="md">
            <EditableH3 id="h3-practice-question-two" blockId="practice-question-two">
                Question 2
            </EditableH3>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-practice-two-content" maxWidth="xl">
        <Block id="practice-two-content" padding="sm">
            <EditableParagraph id="para-practice-two-content" blockId="practice-two-content">
                Workers are building a wall. With 4 workers, it takes 6 days. With more workers, the job finishes faster. This is an example of <InlineFeedback
                    varName="answerProportionType"
                    correctValue="inverse"
                    position="terminal"
                    successMessage="Exactly! More workers means fewer days, and workers × days stays constant"
                    failureMessage="Not quite."
                    hint="When the number of workers increases, what happens to the time needed?"
                    sectionLinks={[{ blockId: "inverse-definition", label: "Review inverse proportion" }]}
                >
                    <InlineClozeChoice
                        varName="answerProportionType"
                        correctAnswer="inverse"
                        options={["direct", "inverse"]}
                        placeholder="???"
                        color="#F7B23B"
                    />
                </InlineFeedback> proportion.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-practice-question-three" maxWidth="xl">
        <Block id="practice-question-three" padding="md">
            <EditableH3 id="h3-practice-question-three" blockId="practice-question-three">
                Question 3
            </EditableH3>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-practice-three-content" maxWidth="xl">
        <Block id="practice-three-content" padding="sm">
            <EditableParagraph id="para-practice-three-content" blockId="practice-three-content">
                In a direct proportion y = kx, if y = 15 when x = 3, what is the value of k? <InlineFeedback
                    varName="answerFindK"
                    correctValue="5"
                    position="terminal"
                    successMessage="Perfect! k = y ÷ x = 15 ÷ 3 = 5"
                    failureMessage="Not quite."
                    hint="Use k = y ÷ x"
                    sectionLinks={[{ blockId: "direct-formula", label: "Review the formula" }]}
                >
                    <InlineClozeInput
                        varName="answerFindK"
                        correctAnswer="5"
                        placeholder="?"
                        color="#AC8BF9"
                    />
                </InlineFeedback>
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Summary
    <StackLayout key="layout-summary-heading" maxWidth="xl">
        <Block id="summary-heading" padding="md">
            <EditableH2 id="h2-summary-heading" blockId="summary-heading">
                Summary
            </EditableH2>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-summary-content" maxWidth="xl">
        <Block id="summary-content" padding="sm">
            <EditableParagraph id="para-summary-content" blockId="summary-content">
                You have learned to identify, graph, and calculate both direct and inverse proportions. Direct proportion (y = kx) creates a straight line through the origin, where quantities grow together. Inverse proportion (y = k/x) creates a curved hyperbola, where one quantity decreases as the other increases. The constant k ties everything together, representing either the ratio (direct) or the product (inverse) of the two quantities.
            </EditableParagraph>
        </Block>
    </StackLayout>,
];
