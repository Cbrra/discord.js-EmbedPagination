EmbedPagination
===

### About
Allows you to create a simple and fully customizable embed pagination with [discord.js](https://github.com/discordjs/discord.js/) v14.

### Functions
Set the user who own this pagination, and the optional error message for others
<br>If no errorMessage provided, everyone can use the pagination
```js
setUserId(userId: Snowflake, errorMessage?: string): this
```

> Set the interaction or the message
<br>`.setInteraction(interaction): this` or `.setMessage(message)`

> Set the longevity (default to 1_200_000)
<br>`.setTime(time: number): this`

> Set the navigation buttons labels
<br>`.setLabels(label0: string, label1: string): this`

> Set additionnal rows to the message
<br>`.setRows(rows: ActionRowBuilder<ButtonBuilder | SelectMenuBuilder>[]): this`

> Add an embed
<br>`addEmbed(embed: EmbedBuilder | ((instance: this) => EmbedBuilder)): this`

> Set embeds
<br>`setEmbeds(embeds: (EmbedBuilder | ((instance: this) => EmbedBuilder))[]): this`

> Add a button
<br>`addButton(button: PaginationButton): this`

> Set buttons
<br>`setButtons(buttons: PaginationButton[]): this`

> If true and if the pagination only contains 1 page, remove the navigation buttons
<br>`autoRemoveUpdateButtons(value: boolean): this`

> Disable the navigation buttons
<br>`disableUpdateButtons(state: boolean): this`

> Disable all the message components at the end of the collector
<br>`disableAtEnd(state: boolean): this`

> Set a callback executed at each page change
<br>`setUpdateCallback(callback: (instance: this, p: number) => void): this`

> Set a callback for your custom components
<br>`setSpecialCallback(callback: (instance: this, i: MessageComponentInteraction | SelectMenuInteraction) => void): this`
`update(): void`

> Start the pagination
<br>`start(page?: number): Promise<void>`

> Change the current page of the pagination (can be use in the callbacks)
<br>`changePage(type: string, interaction: MessageComponentInteraction): void`

### Basic Example
```js
const { EmbedBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

const embed = new EmbedBuilder()
    .setColor("#2a90fe")
    .setTitle("First embed")
    .setDescription("Hello world !");

const embed2 = new EmbedBuilder()
    .setColor("#2a90fe")
    .setTitle("Second embed")
    .setDescription("Hello world 2 !");

const pagination = new EmbedPagination(client.user.id)
    .setUserId(interaction.user.id, "You can't interact with this message !")
    .setInteraction(interaction)
    .setEmbeds([embed, embed2])
    .addButton({
        position: "Right",
        button: new ButtonBuilder()
            .setCustomId("custom-button")
            .setLabel("Right button")
            .setStyle(ButtonStyle.Secondary)
    })
    .setSpecialCallback((instance, i) => i.reply("Clicked !"))
    .start();
```
