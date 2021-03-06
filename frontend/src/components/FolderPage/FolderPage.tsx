import { ChangeEventHandler, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { MdFolder, MdOutlineInsertDriveFile, MdSearch } from 'react-icons/md';
import {
    Cell,
    ColumnName,
    FileRow,
    IconWrapper,
    ListContainer,
    Name,
    SortIcon,
    InputWithSpace,
    BreadcrumbsWithSpace,
    FolderLink,
    ColumnNameButton,
    FolderRow,
    Header,
} from './services/styled';
import {
    by,
    formatSize,
    getBreadcrumbs,
    parseFolderPath,
    useCurrentFolderPath,
    useFolderData,
} from './services/helpers';
import routes, { generateFolderPath } from '../../routes';
import iconSizes from '../../styleTokens/iconSizes';
import PageContainer from '../PageContainer/PageContainer';
import { SortableAttributes } from './services/types';

const FolderPage = () => {
    const folderData = useFolderData();
    const folderPath = useCurrentFolderPath();
    const pathParts = parseFolderPath(folderPath);

    const [inputValue, setInputValue] = useState('');
    const [orderAttribute, setOrderAttribute] =
        useState<SortableAttributes>('name');
    const [isDescending, setIsDescending] = useState(false);

    if (folderData === 'loading') return null;

    if (folderData === 'error')
        return <Navigate replace to={routes.notFound} />;

    // NOTE: Sorting and filtering is an expensive operation on big data sets.
    // Right now, we don't need a memorization since every component update causes a change in options order or number.
    // Please verify that every time component functionality changes.
    const sortedItems = folderData.items
        .filter(({ name }) => name.startsWith(inputValue))
        .sort(by(orderAttribute));

    const orderedSortedItems = isDescending
        ? sortedItems.reverse()
        : sortedItems;

    const files = orderedSortedItems.filter(({ type }) => type === 'file');
    const folders = orderedSortedItems.filter(({ type }) => type === 'dir');

    const handleColumnNameClick = (columnName: SortableAttributes) => () => {
        if (orderAttribute === columnName) {
            setIsDescending((current) => !current);
        }
        setOrderAttribute(columnName);
    };

    const handleInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setInputValue(e.target.value);
    };

    const sortIcon = (
        <SortIcon isRotated={isDescending} size={iconSizes.medium} />
    );

    return (
        <PageContainer>
            <BreadcrumbsWithSpace items={getBreadcrumbs(pathParts)} />

            <InputWithSpace
                icon={<MdSearch size={iconSizes.medium} />}
                onChange={handleInputChange}
                placeholder={`Search in current folder`}
                value={inputValue}
            />

            <Header>
                <Cell>
                    <ColumnNameButton
                        onClick={handleColumnNameClick('name')}
                        type="button"
                    >
                        <ColumnName>Name</ColumnName>
                        {orderAttribute === 'name' && sortIcon}
                    </ColumnNameButton>
                </Cell>

                <Cell>
                    <ColumnNameButton
                        onClick={handleColumnNameClick('sizeKb')}
                        type="button"
                    >
                        <ColumnName>Size</ColumnName>
                        {orderAttribute === 'sizeKb' && sortIcon}
                    </ColumnNameButton>
                </Cell>
            </Header>

            <ListContainer>
                {folders.map(({ name }) => (
                    <FolderRow key={name}>
                        <FolderLink to={generateFolderPath(...pathParts, name)}>
                            <Cell>
                                <IconWrapper>
                                    <MdFolder size={iconSizes.large} />
                                </IconWrapper>
                                <Name>{name}</Name>
                            </Cell>

                            <Cell>-</Cell>
                        </FolderLink>
                    </FolderRow>
                ))}

                {files.map(({ name, sizeKb }) => (
                    <FileRow key={name}>
                        <Cell>
                            <IconWrapper>
                                <MdOutlineInsertDriveFile
                                    size={iconSizes.large}
                                />
                            </IconWrapper>
                            <Name>{name}</Name>
                        </Cell>

                        <Cell>{formatSize(sizeKb)}</Cell>
                    </FileRow>
                ))}
            </ListContainer>
        </PageContainer>
    );
};

export default FolderPage;
