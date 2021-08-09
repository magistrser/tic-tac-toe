import React from 'react';
import assertNever from 'assert-never';
import { CellType } from 'src/client/use_cases/engine/cell_type';
import './index.css';

export function Cell(props: { type: CellType; onClick: () => void }): JSX.Element | null {
    const getBoxClassName = (type: CellType): string => {
        switch (type) {
            case CellType.XOccupied:
                return 'X';

            case CellType.OOccupied:
                return 'O';

            case CellType.Free:
                return '';

            default:
                assertNever(type);
        }

        return '';
    };

    return <button onClick={props.onClick}>{getBoxClassName(props.type)}</button>;
}
