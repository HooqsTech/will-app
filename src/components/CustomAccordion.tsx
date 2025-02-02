import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material'
import { ArrowDropDownIcon } from '@mui/x-date-pickers'
import React from 'react'

interface ICustomAccordionProps {
    label: string;
    children: React.ReactNode;
}

const CustomAccordion: React.FC<ICustomAccordionProps> = ({ label, children }) => {
    return (
        <Accordion  >
            <AccordionSummary
                expandIcon={<ArrowDropDownIcon />}
            >
                <Typography component="span">{label}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                {children}
            </AccordionDetails>
        </Accordion>
    )
}

export default CustomAccordion