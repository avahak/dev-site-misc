import { styled, Paper, IconButton, Box } from '@mui/material';

export const DocumentWrapper = styled('div')({
    position: 'relative',
});

// Toggle Button: Nearly invisible when idle (15%), reveals on activity (85%), full on direct hover (100%)
export const ToggleButton = styled(IconButton, {
    shouldForwardProp: (prop) => prop !== 'isOpen',
})<{ isOpen: boolean }>(({ theme, isOpen }) => ({
    float: 'left',
    padding: 2,
    marginTop: 2,
    marginRight: theme.spacing(1),
    // color: theme.palette.text.secondary,
    color: theme.palette.text.secondary,
    border: `3px solid ${theme.palette.primary.main}`,
    borderRadius: theme.shape.borderRadius,
    opacity: 0.15,
    transition: theme.transitions.create(['transform', 'border-color', 'color', 'opacity'], {
        duration: theme.transitions.duration.standard,
    }),
    transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',

    '.is-active &': {
        opacity: 0.85,
    },

    '&:hover, &:focus': {
        opacity: 1,
        color: theme.palette.text.primary,
        borderColor: theme.palette.primary.main,
        backgroundColor: 'transparent',
    },
}));

// Reference Trigger Link: Looks like plain text when idle, highlights subtle blue on activity
export const RefTrigger = styled('span')(({ theme }) => ({
    color: 'inherit',
    cursor: 'pointer',
    borderBottom: '1px dotted transparent',
    transition: theme.transitions.create(['color', 'border-color', 'background-color'], {
        duration: theme.transitions.duration.standard,
    }),

    '.is-active &': {
        color: theme.palette.info.light,
        borderBottomColor: theme.palette.info.light,
        fontWeight: 500,
    },

    '&:hover': {
        color: theme.palette.info.light,
        borderBottomColor: theme.palette.info.light,
        backgroundColor: theme.palette.action.selected,
    },
}));

export const TargetHeader = styled('div')(({ theme }) => ({
    fontWeight: 700,
    margin: theme.spacing(0),
    padding: theme.spacing(0),
    // marginBottom: theme.spacing(0.5),
    color: theme.palette.text.primary,
}));

// Target block wrapper (Lemma, Theorem, Definition, etc.)
export const TargetContainer = styled('div')(({ theme }) => ({
    padding: theme.spacing(1),
    margin: theme.spacing(0, 0),
    borderLeft: `4px solid ${theme.palette.primary.main}`,
    backgroundColor: theme.palette.action.hover,
    borderRadius: theme.shape.borderRadius,
}));

export const TargetContent = styled('div')(({ theme }) => ({
    '& > p:first-of-type': {
        marginTop: 0,
    },
    '& > p:last-of-type': {
        marginBottom: 0,
    },
}));

// Hover Popup Card
export const DebugPopupPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    maxWidth: 500,
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: theme.shadows[8],
}));

// Expandable / Proof Container with Clearfix
export const ExpandableContainer = styled(Box)(({ theme }) => ({
    margin: theme.spacing(0, 0),
    '&::after': {
        content: '""',
        display: 'table',
        clear: 'both',
    },
}));

export const SummaryContainer = styled(Box)(({ theme }) => ({
    // cursor: 'pointer',
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(0, 1),
    transition: theme.transitions.create(['box-shadow', 'background-color'], {
        duration: theme.transitions.duration.shorter,
    }),
    '&:hover': {
        // backgroundColor: theme.palette.action.hover,
        // boxShadow: `0 0 0 1px ${theme.palette.divider}`,
    },
}));

export const DetailContainer = styled(Box)({});