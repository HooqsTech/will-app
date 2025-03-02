import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material'
import { ArrowDropDownIcon } from '@mui/x-date-pickers'
import React from 'react'

interface ICustomAccordionProps {
    label: string;
    children: React.ReactNode;
    subTitle?: string;
    onChange?: () => void;
    expanded?: boolean;
    defaultExpanded?: boolean;
    error?: boolean;
}

const CustomAccordion: React.FC<ICustomAccordionProps> = ({ label, children, subTitle, onChange, expanded, defaultExpanded, error }) => {
    return (
        <div className='py-2'>
            <Accordion expanded={expanded} defaultExpanded={defaultExpanded} className={`bg-red-50 ${error && 'border-1 border-red-300'} `} onChange={onChange}>
                <AccordionSummary
                    expandIcon={<ArrowDropDownIcon />}
                >
                    <div className='flex flex-col items-start'>
                        <Typography>{label}</Typography>
                        {
                            subTitle !== "" &&
                            <p className='text-xs pt-2'>
                                {subTitle?.split("\n").map((line, index) => (
                                    <React.Fragment key={index}>
                                        {line}
                                        <br />
                                    </React.Fragment>
                                ))}
                            </p>
                        }
                    </div>
                </AccordionSummary>
                <AccordionDetails>
                    {children}
                </AccordionDetails>
            </Accordion>
        </div>
    )
}

export default CustomAccordion