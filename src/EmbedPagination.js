const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SelectMenuBuilder } = require("discord.js");

class EmbedPagination {
    constructor(clientId) {
        this.clientId = clientId;

        this.userId = null;
        this.errorMessage = null;

        this.message = null;
        this.interaction = null;

        this.time = 1_200_000;
        this.labels = new Array(2);
        this.embeds = [];

        this.rows = [];
        this.buttons = [];

        this.isUpdateButtonsAutoRemoved = false;
        this.isUpdateButtonsDisabled = false;
        this.isDisableAtEnd = true;

        this.updateCallback = null;
        this.specialCallback = null;

        this.page = 1;
        this._msg = null;
    };

    setUserId(userId, errorMessage) {
        this.userId = userId;
        if(errorMessage) this.errorMessage = errorMessage;

        return this;
    };

    setMessage(message) {
        this.message = message;
        return this;
    };

    setInteraction(interaction) {
        this.interaction = interaction;
        return this;
    };

    setTime(time) {
        this.time = time;
        return this;
    };

    setLabels(label0, label1) {
        this.labels = [label0, label1];
        return this;
    };

    setRows(rows) {
        if(!Array.isArray(rows)) throw new TypeError("rows must be an array");
        if(rows.length > 4) throw new RangeError("You can't specify more than 4 rows");

        this.rows = rows;
        return this;
    };

    addEmbed(embed) {
        this.embeds.push(embed);
        return this;
    };

    setEmbeds(embeds) {
        if(!Array.isArray(embeds)) throw new TypeError("embeds must be an array");
        this.embeds = embeds;
        return this;
    };

    addButton(button) {
        if(this.buttons.length > 2) throw new RangeError("You can't specify more than 3 buttons");

        this.buttons.push(button);
        return this;
    };

    setButtons(buttons) {
        if(!Array.isArray(buttons)) throw new TypeError("buttons must be an array");
        if(buttons.length > 2) throw new RangeError("You can't specify more than 3 buttons");

        this.buttons = buttons;
        return this;
    };

    autoRemoveUpdateButtons(value) {
        this.isUpdateButtonsAutoRemoved = value;
        return this;
    };

    disableUpdateButtons(state = true) {
        this.isUpdateButtonsDisabled = state;
        return this;
    };

    disableAtEnd(state = true) {
        this.isDisableAtEnd = state;
        return this;
    };

    setUpdateCallback(callback) {
        this.updateCallback = callback;
        return this;
    };

    setSpecialCallback(callback) {
        this.specialCallback = callback;
        return this;
    };

    update() {
        if(!this._msg.editable) return;

        let embed = this.embeds[this.page -1];
        if(typeof embed === "function") embed = embed(this);

        this._msg.edit({ embeds: [embed], components: this.getRows() });
    };

    async start(page = 1) {
        // Check properties
        if(
            !this.message && !this.interaction ||
            !this.embeds.length ||
            page > this.embeds.length
        ) throw new Error("Invalid pagination configuration");

        this.page = page;

        // Create the embed
        let embed = this.embeds[this.page - 1];
        if(typeof embed === "function") embed = embed(this);

        // Get the function
        let sendFn;

        if(this.message) sendFn = (this.message.author.id === this.clientId ? this.message.edit : this.message.reply).bind(this.message);
        else sendFn = this.interaction.reply.bind(this.interaction);

        // Send the pagination
        this._msg = await sendFn({
            content: null,
            embeds: [embed],
            components: this.getRows(),
            allowedMentions: { repliedUser: false },
            fetchReply: true
        });

        // Create the collector
        const collector = this._msg.createMessageComponentCollector({ time: this.time });

        collector.on("collect", i => {
            if(this.userId && i.user.id !== this.userId) {
                if(this.errorMessage) i.reply({ content: this.errorMessage, ephemeral: true });
                return;
            };

            if(["previous", "next"].includes(i.customId)) return this.changePage(i.customId, i);
            if(this.specialCallback) return this.specialCallback(this, i);

            i.deferUpdate();
        });

        collector.on("end", () => {
            if(!this.isDisableAtEnd) return;

            const rows = this.getRows();
            for(const { components } of rows)
                components.forEach(c => {
                    if(
                        c instanceof ButtonBuilder ||
                        c instanceof SelectMenuBuilder
                    ) c.setDisabled(true)
                });

            if(this._msg.editable) this._msg.edit({ components: rows });
        });
    };

    changePage(type, interaction) {
        if(!this._msg.editable) return;

        if(type === "previous") this.page--;
        else if(type === "next") this.page++;
        else throw new Error(`type must be "previous" or "next", received: ${type}`);

        this.updateCallback?.(this, this.page);

        let embed = this.embeds[this.page -1];
        if(typeof embed === "function") embed = embed(this);

        this._msg.edit({
            embeds: [embed],
            components: this.getRows()
        });

        interaction.deferUpdate();
    };

    getRows() {
        const atLeft = [];
        const atCenter = [];
        const atRight = [];

        for(const b of this.buttons)
            switch(b.position) {
                case "Left": atLeft.push(b.button); break;
                case "Center": atCenter.push(b.button); break;
                default: atRight.push(b.button); break;
            };

        let newRows = [new ActionRowBuilder(), ...this.rows];

        if(!this.isUpdateButtonsDisabled && (this.embeds.length > 1 || !this.isUpdateButtonsAutoRemoved)) {
            const previousBtn = new ButtonBuilder()
                .setCustomId("previous")
                .setLabel(this.labels[0] || "Page précédente")
                .setStyle(ButtonStyle.Primary)
                .setDisabled(this.page === 1);

            const nextBtn = new ButtonBuilder()
                .setCustomId("next")
                .setLabel(this.labels[1] || "Page suivante")
                .setStyle(ButtonStyle.Primary)
                .setDisabled(this.embeds.length === this.page);

            newRows[0].components = [...atLeft, previousBtn, ...atCenter, nextBtn, ...atRight];
        } else newRows[0].components = [...atLeft, ...atCenter, ...atRight];

        if(!newRows[0].components.length) newRows = newRows.slice(1);

        return newRows;
    };
};

module.exports = EmbedPagination;
