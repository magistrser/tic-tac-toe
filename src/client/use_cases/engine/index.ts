import _ from 'lodash';
import { CellType, PlayerType } from 'src/client/use_cases/engine/cell_type';
import assertNever from 'assert-never';

export type Field = CellType[];

class TicTacToeEngine {
    private fieldLength = 3;

    private field: Field = Array(this.getCellCount()).fill(CellType.Free);
    private currentPlayer = PlayerType.X;

    getField(): Field {
        return _.cloneDeep(this.field);
    }

    getCurrentPlayer(): PlayerType {
        return this.currentPlayer;
    }

    getFieldLength(): number {
        return this.fieldLength;
    }

    setFieldLength(length: number) {
        this.fieldLength = length;
        this.reset();
    }

    updateCell(id: number): boolean {
        if (!(id < this.getCellCount())) {
            throw new Error(`Invalid id(${id}), must be less than: ${this.getCellCount()}`);
        }

        if (this.field[id] !== CellType.Free || this.hasWinner() !== null) {
            return false;
        }

        switch (this.currentPlayer) {
            case PlayerType.X:
                this.field[id] = CellType.XOccupied;
                break;

            case PlayerType.O:
                this.field[id] = CellType.OOccupied;
                break;

            default:
                assertNever(this.currentPlayer);
        }

        this.switchPlayer();
        return true;
    }

    hasWinner(): PlayerType | null {
        const getPlayerFromCell = (cellType: CellType): PlayerType | null => {
            switch (cellType) {
                case CellType.XOccupied:
                    return PlayerType.X;

                case CellType.OOccupied:
                    return PlayerType.O;

                case CellType.Free:
                    return null;

                default:
                    assertNever(cellType);
            }
        };

        // row
        for (let i = 0; i < this.fieldLength; ++i) {
            let hasWinner = true;
            for (let j = 1; j < this.fieldLength; ++j) {
                const cell = this.field[i * this.fieldLength + j];
                if (this.field[i * this.fieldLength + j - 1] !== cell || cell === CellType.Free) {
                    hasWinner = false;
                    break;
                }
            }

            if (hasWinner) {
                return getPlayerFromCell(this.field[i * this.fieldLength]);
            }
        }

        // column
        for (let i = 0; i < this.fieldLength; ++i) {
            let hasWinner = true;
            for (let j = 1; j < this.fieldLength; ++j) {
                const cell = this.field[i + this.fieldLength * j];
                if (this.field[i + this.fieldLength * (j - 1)] !== cell || cell === CellType.Free) {
                    hasWinner = false;
                    break;
                }
            }

            if (hasWinner) {
                return getPlayerFromCell(this.field[i]);
            }
        }

        // diagonal - \
        let hasWinner = true;
        for (let i = 1; i < this.fieldLength; ++i) {
            const cell = this.field[i * (this.fieldLength + 1)];
            if (this.field[(i - 1) * (this.fieldLength + 1)] !== cell || cell === CellType.Free) {
                hasWinner = false;
                break;
            }
        }

        if (hasWinner) {
            return getPlayerFromCell(this.field[0]);
        }

        // diagonal - /
        hasWinner = true;
        for (let i = 1; i < this.fieldLength; ++i) {
            const cell = this.field[(i + 1) * (this.fieldLength - 1)];
            if (this.field[i * (this.fieldLength - 1)] !== cell || cell === CellType.Free) {
                hasWinner = false;
                break;
            }
        }

        if (hasWinner) {
            return getPlayerFromCell(this.field[this.fieldLength - 1]);
        }

        return null;
    }

    private getCellCount(): number {
        return this.fieldLength * this.fieldLength;
    }

    private switchPlayer() {
        switch (this.currentPlayer) {
            case PlayerType.X:
                this.currentPlayer = PlayerType.O;
                break;

            case PlayerType.O:
                this.currentPlayer = PlayerType.X;
                break;

            default:
                assertNever(this.currentPlayer);
        }
    }

    private reset() {
        this.field = Array(this.getCellCount()).fill(CellType.Free);
        this.currentPlayer = PlayerType.X;
    }
}

export const engine = new TicTacToeEngine();
