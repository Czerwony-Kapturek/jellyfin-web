import React, { FC, useCallback, useEffect, useRef } from 'react';
import { Events } from 'jellyfin-apiclient';
import IconButtonElement from '../../elements/IconButtonElement';
import { QueryI } from './interface';

interface FilterI {
    query: QueryI;
    getFilterMode: () => string | null;
    reloadItems: () => void;
}

const Filter: FC<FilterI> = ({ query, getFilterMode, reloadItems }) => {
    const element = useRef<HTMLDivElement>(null);

    const showFilterMenu = useCallback(() => {
        import('../../components/filterdialog/filterdialog').then(({default: filterDialogFactory}) => {
            const filterDialog = new filterDialogFactory({
                query: query,
                mode: getFilterMode(),
                serverId: window.ApiClient.serverId()
            });
            Events.on(filterDialog, 'filterchange', () => {
                query.StartIndex = 0;
                reloadItems();
            });
            filterDialog.show();
        });
    }, [getFilterMode, query, reloadItems]);

    useEffect(() => {
        const btnFilter = element.current?.querySelector('.btnFilter');

        if (btnFilter) {
            btnFilter.addEventListener('click', showFilterMenu);
        }
    }, [showFilterMenu]);

    return (
        <div ref={element}>
            <IconButtonElement
                is='paper-icon-button-light'
                className='btnFilter autoSize'
                title='Filter'
                icon='material-icons filter_list'
            />
        </div>
    );
};

export default Filter;
