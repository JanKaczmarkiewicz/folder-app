import { Fragment } from 'react';
import { MdKeyboardArrowRight } from 'react-icons/md';
import iconSizes from '../../styleTokens/iconSizes';
import { Breadcrumb, Container } from './services/styled';

type BreadcrumbProps = {
    items: { label: string; to: string }[];
    className?: string;
};

const Breadcrumbs = ({ items, className }: BreadcrumbProps) => {
    const lastIndex = items.length - 1;

    return (
        <Container aria-label="Breadcrumb" className={className}>
            {items.map(({ to, label }, index) => (
                <Fragment key={to}>
                    {index !== lastIndex ? (
                        <>
                            <Breadcrumb to={to}>{label}</Breadcrumb>
                            <MdKeyboardArrowRight size={iconSizes.large} />
                        </>
                    ) : (
                        <Breadcrumb aria-current="page" to={to}>
                            {label}
                        </Breadcrumb>
                    )}
                </Fragment>
            ))}
        </Container>
    );
};

export default Breadcrumbs;
