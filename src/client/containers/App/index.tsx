import React, { useState } from 'react';
import assertNever from 'assert-never';
import { engine, Field } from 'src/client/use_cases/engine';
import { Cell } from 'src/client/components/Cell';
import { PlayerType } from 'src/client/use_cases/engine/cell_type';
import './index.less';

enum InfoMessage {
    PlayerX = 'Player: X',
    PlayerO = 'Player: O',
}

function getInfoMessageByPlayerType(playerType: PlayerType): InfoMessage {
    switch (playerType) {
        case PlayerType.X:
            return InfoMessage.PlayerX;

        case PlayerType.O:
            return InfoMessage.PlayerO;

        default:
            assertNever(playerType);
    }
}

export function App(): JSX.Element {
    const [field, setField] = useState<Field>(engine.getField());
    const [fieldLength, setFieldLength] = useState(engine.getFieldLength());
    const [info, setInfo] = useState<string>(getInfoMessageByPlayerType(engine.getCurrentPlayer()));

    const onClick = (id: number) => {
        if (!engine.updateCell(id)) {
            return;
        }

        const winner = engine.hasWinner();
        if (winner !== null) {
            setInfo(getInfoMessageByPlayerType(winner) + ' Win!');
            setField(engine.getField());
            return;
        }

        setInfo(getInfoMessageByPlayerType(engine.getCurrentPlayer()));
        setField(engine.getField());
    };

    const onSetFieldLength = (length: number) => {
        engine.setFieldLength(length);
        setFieldLength(length);
        setInfo(getInfoMessageByPlayerType(engine.getCurrentPlayer()));
        setField(engine.getField());
    };

    const renderField = (): JSX.Element[] => {
        const renderRow = (i: number) => {
            const cells = [];
            const offset = i * engine.getFieldLength();
            for (let j = offset; j < offset + engine.getFieldLength(); ++j) {
                cells.push(<Cell key={`cell-${j}`} type={field[j]} onClick={() => onClick(j)} />);
            }
            return (
                <div key={`row-${i} fieldRow`} className={'fieldRow'}>
                    {cells}
                </div>
            );
        };

        const rows = [];
        for (let i = 0; i < engine.getFieldLength(); ++i) {
            rows.push(renderRow(i));
        }

        return rows;
    };

    return (
        <div className={'main'}>
            <div className={'app'}>
                <div className={'infoMessage'}>{info}</div>
                <div className={'field'}>{renderField()}</div>
                <div className={'fieldSize'}>
                    Field length:
                    <input type={'number'} value={fieldLength} onChange={(event) => onSetFieldLength(Number(event.target.value))} />
                </div>
            </div>
        </div>
    );
}
