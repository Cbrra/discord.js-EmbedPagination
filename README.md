EmbedPagination
===

### About
Allows you to create a simple and fully customizable embed pagination with [discord.js](https://github.com/discordjs/discord.js/) v14.

### Functions
```js
setUserId(userId: Snowflake, errorMessage?: string): this
```
Set the user who own this pagination, and the optional error message for others
<br>If no errorMessage provided, everyone can use the pagination

```js
.setInteraction(interaction): this
or
.setMessage(message): this
```
Set the interaction or the message

```js
.setTime(time: number): this
```
Set the longevity (default to 1_200_000)

```js
.setLabels(label0: string, label1: string): this
```
Set the navigation buttons labels

```js
.setRows(rows: ActionRowBuilder<ButtonBuilder | SelectMenuBuilder>[]): this
```
Set additionnal rows to the message

```js
addEmbed(embed: EmbedBuilder | ((instance: this) => EmbedBuilder)): this
```
Add an embed

```js
setEmbeds(embeds: (EmbedBuilder | ((instance: this) => EmbedBuilder))[]): this
```
Set embeds

```js
addButton(button: PaginationButton): this
```
Add a button

```js
setButtons(buttons: PaginationButton[]): this
```
Set buttons

```js
autoRemoveUpdateButtons(value: boolean): this
```
If true and if the pagination only contains 1 page, remove the navigation buttons

```js
disableUpdateButtons(state: boolean): this
```
Disable the navigation buttons

```js
disableAtEnd(state: boolean): this
```
Disable all the message components at the end of the collector

```js
setUpdateCallback(callback: (instance: this, p: number) => void): this
```
Set a callback executed at each page change

```js
setSpecialCallback(callback: (instance: this, i: MessageComponentInteraction | SelectMenuInteraction) => void)
: this
```
Set a callback for your custom components

```js
update(): void
```
Update the pagination

```js
start(page?: number): Promise<void>
```
Start the pagination

```js
changePage(type: string, interaction: MessageComponentInteraction): void
```
Change the current page of the pagination (can be use in the callbacks)

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
