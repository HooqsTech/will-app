import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material'
import { ArrowDropDownIcon } from '@mui/x-date-pickers'
import React from 'react'

interface ICustomAccordionProps {
    label: string;
    children: React.ReactNode;
    subTitle?: string;
    onChange?: () => void;
    expanded?: boolean;
}

const CustomAccordion: React.FC<ICustomAccordionProps> = ({ label, children, subTitle, onChange, expanded }) => {
    return (
        <div className='p-2'>
            <Accordion expanded={expanded} className="bg-red-50" onChange={onChange}>
                <AccordionSummary
                    expandIcon={<ArrowDropDownIcon />}
                >
                    <div>
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