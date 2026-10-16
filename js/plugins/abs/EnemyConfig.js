class EnemyConfig {
    static fromComments(comments) {
        const text = comments.join("\n");

        return {
            isEnemy: text.includes("<abs_enemy>"),
            hp: this.getValue(text, "hp"),
            vision: this.getValue(text, "vision"),
            damage: this.getValue(text, "damage"),
            attackRange: this.getValue(text, "attack_range"),
            attackCooldown: this.getValue(text, "attack_cooldown")
        };
    }

    static getValue(text, key) {
        const regex = new RegExp(`<${key}:(\\d+)>`);
        const match = text.match(regex);

        return match ? Number(match[1]) : 0;
    }
}