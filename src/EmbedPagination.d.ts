import { CommandInteraction, ActionRowBuilder, MessageComponentInteraction, Message, SelectMenuInteraction, ButtonBuilder, EmbedBuilder, SelectMenuBuilder, Snowflake } from "discord.js";

declare enum ButtonPosition {
    Left,
    Center,
    Right
}

declare interface PaginationButton {
    button: ButtonBuilder;
    position: keyof typeof ButtonPosition;
}

declare class EmbedPagination {
    public constructor(clientId: Snowflake);
    public readonly clientId: Snowflake;
    public userId?: string;
    public errorMessage?: string;
    public message?: Message;
    public interaction?: CommandInteraction;
    public time: number;
    public labels: string[];
    public embeds: (EmbedBuilder | ((instance: this) => EmbedBuilder))[];
    public rows: ActionRowBuilder<ButtonBuilder | SelectMenuBuilder>[];
    public buttons: PaginationButton[];
    public isUpdateButtonsAutoRemoved: boolean;
    public isUpdateButtonsDisabled: boolean;
    public isDisableAtEnd: boolean;
    public updateCallback?: (instance: this, p: number) => void;
    public specialCallback?: (instance: this, i: MessageComponentInteraction | SelectMenuInteraction) => void;
    public page?: number;
    private _msg?: Message;

    public setUserId(userId: Snowflake, errorMessage?: string): this;
    public setMessage(message: Message): this;
    public setInteraction(interaction: CommandInteraction): this;
    public setTime(time: number): this;
    public setLabels(label0: string, label1: string): this;
    public setRows(rows: ActionRowBuilder<ButtonBuilder | SelectMenuBuilder>[]): this;
    public addEmbed(embed: EmbedBuilder | ((instance: this) => EmbedBuilder)): this;
    public setEmbeds(embeds: (EmbedBuilder | ((instance: this) => EmbedBuilder))[]): this;
    public addButton(button: PaginationButton): this;
    public setButtons(buttons: PaginationButton[]): this;
    public autoRemoveUpdateButtons(value: boolean): this;
    public disableUpdateButtons(state: boolean): this;
    public disableAtEnd(state: boolean): this;
    public setUpdateCallback(callback: (instance: this, p: number) => void): this;
    public setSpecialCallback(callback: (instance: this, i: MessageComponentInteraction | SelectMenuInteraction) => void): this;
    public update(): void;
    public start(page?: number): Promise<void>;
    public changePage(type: string, interaction: MessageComponentInteraction): void;
    private getRows(): ActionRowBuilder<ButtonBuilder | SelectMenuBuilder>[];
}

export = EmbedPagination;