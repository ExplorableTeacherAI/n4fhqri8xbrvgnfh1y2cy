/**
 * Variables Configuration
 * =======================
 *
 * CENTRAL PLACE TO DEFINE ALL SHARED VARIABLES
 *
 * This file defines all variables that can be shared across sections.
 * AI agents should read this file to understand what variables are available.
 *
 * USAGE:
 * 1. Define variables here with their default values and metadata
 * 2. Use them in any section with: const x = useVar('variableName', defaultValue)
 * 3. Update them with: setVar('variableName', newValue)
 */

import { type VarValue } from '@/stores';

/**
 * Variable definition with metadata
 */
export interface VariableDefinition {
    /** Default value */
    defaultValue: VarValue;
    /** Human-readable label */
    label?: string;
    /** Description for AI agents */
    description?: string;
    /** Variable type hint */
    type?: 'number' | 'text' | 'boolean' | 'select' | 'array' | 'object' | 'spotColor' | 'linkedHighlight';
    /** Unit (e.g., 'Hz', '°', 'm/s') - for numbers */
    unit?: string;
    /** Minimum value (for number sliders) */
    min?: number;
    /** Maximum value (for number sliders) */
    max?: number;
    /** Step increment (for number sliders) */
    step?: number;
    /** Display color for InlineScrubbleNumber / InlineSpotColor (e.g. '#D81B60') */
    color?: string;
    /** Options for 'select' type variables */
    options?: string[];
    /** Placeholder text for text inputs */
    placeholder?: string;
    /** Correct answer for cloze input validation */
    correctAnswer?: string;
    /** Whether cloze matching is case sensitive */
    caseSensitive?: boolean;
    /** Background color for inline components */
    bgColor?: string;
    /** Schema hint for object types (for AI agents) */
    schema?: string;
}

/**
 * =====================================================
 * 🎯 DEFINE YOUR VARIABLES HERE
 * =====================================================
 */
export const variableDefinitions: Record<string, VariableDefinition> = {
    // ========================================
    // DIRECT PROPORTION VARIABLES
    // ========================================
    directConstantK: {
        defaultValue: 2,
        type: 'number',
        label: 'Constant k (Direct)',
        description: 'The constant of proportionality for direct proportion y = kx',
        min: 0.5,
        max: 5,
        step: 0.5,
        color: '#62D0AD',
    },
    directX: {
        defaultValue: 3,
        type: 'number',
        label: 'X Value (Direct)',
        description: 'The x value for direct proportion',
        min: 0,
        max: 10,
        step: 1,
        color: '#8E90F5',
    },

    // ========================================
    // INVERSE PROPORTION VARIABLES
    // ========================================
    inverseConstantK: {
        defaultValue: 12,
        type: 'number',
        label: 'Constant k (Inverse)',
        description: 'The constant of proportionality for inverse proportion y = k/x',
        min: 4,
        max: 24,
        step: 2,
        color: '#F7B23B',
    },
    inverseX: {
        defaultValue: 3,
        type: 'number',
        label: 'X Value (Inverse)',
        description: 'The x value for inverse proportion',
        min: 1,
        max: 10,
        step: 1,
        color: '#AC8BF9',
    },

    // ========================================
    // COMPARISON VARIABLES
    // ========================================
    comparisonK: {
        defaultValue: 6,
        type: 'number',
        label: 'Constant k (Comparison)',
        description: 'Shared constant for comparing direct and inverse',
        min: 2,
        max: 12,
        step: 1,
        color: '#62CCF9',
    },

    // ========================================
    // PRACTICE QUESTION ANSWERS
    // ========================================
    answerDirectCalculation: {
        defaultValue: '',
        type: 'text',
        label: 'Direct Proportion Calculation Answer',
        description: 'Student answer for direct proportion calculation',
        placeholder: '?',
        correctAnswer: '20',
        color: '#62D0AD',
    },
    answerInverseCalculation: {
        defaultValue: '',
        type: 'text',
        label: 'Inverse Proportion Calculation Answer',
        description: 'Student answer for inverse proportion calculation',
        placeholder: '?',
        correctAnswer: '3',
        color: '#F7B23B',
    },
    answerProportionType: {
        defaultValue: '',
        type: 'select',
        label: 'Proportion Type Answer',
        description: 'Student choice for identifying proportion type',
        placeholder: '???',
        correctAnswer: 'inverse',
        options: ['direct', 'inverse'],
        color: '#8E90F5',
    },
    answerProportionTypeDirect: {
        defaultValue: '',
        type: 'select',
        label: 'Direct Proportion Type Answer',
        description: 'Student choice for identifying direct proportion',
        placeholder: '???',
        correctAnswer: 'direct',
        options: ['direct', 'inverse'],
        color: '#62D0AD',
    },
    answerFindK: {
        defaultValue: '',
        type: 'text',
        label: 'Find K Answer',
        description: 'Student answer for finding the constant k',
        placeholder: '?',
        correctAnswer: '5',
        color: '#AC8BF9',
    },

    // ========================================
    // LINKED HIGHLIGHT VARIABLES
    // ========================================
    directHighlight: {
        defaultValue: '',
        type: 'linkedHighlight',
        label: 'Direct Proportion Highlight',
        description: 'Linked highlight for direct proportion visualization',
        color: '#62D0AD',
        bgColor: 'rgba(98, 208, 173, 0.15)',
    },
    inverseHighlight: {
        defaultValue: '',
        type: 'linkedHighlight',
        label: 'Inverse Proportion Highlight',
        description: 'Linked highlight for inverse proportion visualization',
        color: '#F7B23B',
        bgColor: 'rgba(247, 178, 59, 0.15)',
    },
};

/**
 * Get all variable names (for AI agents to discover)
 */
export const getVariableNames = (): string[] => {
    return Object.keys(variableDefinitions);
};

/**
 * Get a variable's default value
 */
export const getDefaultValue = (name: string): VarValue => {
    return variableDefinitions[name]?.defaultValue ?? 0;
};

/**
 * Get a variable's metadata
 */
export const getVariableInfo = (name: string): VariableDefinition | undefined => {
    return variableDefinitions[name];
};

/**
 * Get all default values as a record (for initialization)
 */
export const getDefaultValues = (): Record<string, VarValue> => {
    const defaults: Record<string, VarValue> = {};
    for (const [name, def] of Object.entries(variableDefinitions)) {
        defaults[name] = def.defaultValue;
    }
    return defaults;
};

/**
 * Get number props for InlineScrubbleNumber from a variable definition.
 * Use with getVariableInfo(name) in blocks.tsx, or getExampleVariableInfo(name) in exampleBlocks.tsx.
 */
export function numberPropsFromDefinition(def: VariableDefinition | undefined): {
    defaultValue?: number;
    min?: number;
    max?: number;
    step?: number;
    color?: string;
} {
    if (!def || def.type !== 'number') return {};
    return {
        defaultValue: def.defaultValue as number,
        min: def.min,
        max: def.max,
        step: def.step,
        ...(def.color ? { color: def.color } : {}),
    };
}

/**
 * Get cloze input props for InlineClozeInput from a variable definition.
 * Use with getVariableInfo(name) in blocks.tsx, or getExampleVariableInfo(name) in exampleBlocks.tsx.
 */
/**
 * Get cloze choice props for InlineClozeChoice from a variable definition.
 * Use with getVariableInfo(name) in blocks.tsx.
 */
export function choicePropsFromDefinition(def: VariableDefinition | undefined): {
    placeholder?: string;
    color?: string;
    bgColor?: string;
} {
    if (!def || def.type !== 'select') return {};
    return {
        ...(def.placeholder ? { placeholder: def.placeholder } : {}),
        ...(def.color ? { color: def.color } : {}),
        ...(def.bgColor ? { bgColor: def.bgColor } : {}),
    };
}

/**
 * Get toggle props for InlineToggle from a variable definition.
 * Use with getVariableInfo(name) in blocks.tsx.
 */
export function togglePropsFromDefinition(def: VariableDefinition | undefined): {
    color?: string;
    bgColor?: string;
} {
    if (!def || def.type !== 'select') return {};
    return {
        ...(def.color ? { color: def.color } : {}),
        ...(def.bgColor ? { bgColor: def.bgColor } : {}),
    };
}

export function clozePropsFromDefinition(def: VariableDefinition | undefined): {
    placeholder?: string;
    color?: string;
    bgColor?: string;
    caseSensitive?: boolean;
} {
    if (!def || def.type !== 'text') return {};
    return {
        ...(def.placeholder ? { placeholder: def.placeholder } : {}),
        ...(def.color ? { color: def.color } : {}),
        ...(def.bgColor ? { bgColor: def.bgColor } : {}),
        ...(def.caseSensitive !== undefined ? { caseSensitive: def.caseSensitive } : {}),
    };
}

/**
 * Get spot-color props for InlineSpotColor from a variable definition.
 * Extracts the `color` field.
 *
 * @example
 * <InlineSpotColor
 *     varName="radius"
 *     {...spotColorPropsFromDefinition(getVariableInfo('radius'))}
 * >
 *     radius
 * </InlineSpotColor>
 */
export function spotColorPropsFromDefinition(def: VariableDefinition | undefined): {
    color: string;
} {
    return {
        color: def?.color ?? '#8B5CF6',
    };
}

/**
 * Get linked-highlight props for InlineLinkedHighlight from a variable definition.
 * Extracts the `color` and `bgColor` fields.
 *
 * @example
 * <InlineLinkedHighlight
 *     varName="activeHighlight"
 *     highlightId="radius"
 *     {...linkedHighlightPropsFromDefinition(getVariableInfo('activeHighlight'))}
 * >
 *     radius
 * </InlineLinkedHighlight>
 */
export function linkedHighlightPropsFromDefinition(def: VariableDefinition | undefined): {
    color?: string;
    bgColor?: string;
} {
    return {
        ...(def?.color ? { color: def.color } : {}),
        ...(def?.bgColor ? { bgColor: def.bgColor } : {}),
    };
}

/**
 * Build the `variables` prop for FormulaBlock from variable definitions.
 *
 * Takes an array of variable names and returns the config map expected by
 * `<FormulaBlock variables={...} />`.
 *
 * @example
 * import { scrubVarsFromDefinitions } from './variables';
 *
 * <FormulaBlock
 *     latex="\scrub{mass} \times \scrub{accel}"
 *     variables={scrubVarsFromDefinitions(['mass', 'accel'])}
 * />
 */
export function scrubVarsFromDefinitions(
    varNames: string[],
): Record<string, { min?: number; max?: number; step?: number; color?: string }> {
    const result: Record<string, { min?: number; max?: number; step?: number; color?: string }> = {};
    for (const name of varNames) {
        const def = variableDefinitions[name];
        if (!def) continue;
        result[name] = {
            ...(def.min !== undefined ? { min: def.min } : {}),
            ...(def.max !== undefined ? { max: def.max } : {}),
            ...(def.step !== undefined ? { step: def.step } : {}),
            ...(def.color ? { color: def.color } : {}),
        };
    }
    return result;
}
