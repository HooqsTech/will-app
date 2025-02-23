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
}

const CustomAccordion: React.FC<ICustomAccordionProps> = ({ label, children, subTitle, onChange, expanded, defaultExpanded }) => {
    return (
        <div className='py-2'>
            <Accordion expanded={expanded} defaultExpanded={defaultExpanded} className="bg-red-50" onChange={onChange}>
                <AccordionSummary
                    sx={{
                    }}
                    expandIcon={<ArrowDropDownIcon />}
                >
                    <>
                        <Typography>{label}</Typography>
                        {
                            subTitle !== "" &&
                            <p>
                                {subTitle?.split("\n").map((line, index) => (
                                    <React.Fragment key={index}>
                                        {line}
                                        <br />
                                    </React.Fragment>
                                ))}
                            </p>
                        }
                    </>
                </AccordionSummary>
                <AccordionDetails>
                    {children}
                </AccordionDetails>
            </Accordion>
        </div>
    )
}

export default CustomAccordion