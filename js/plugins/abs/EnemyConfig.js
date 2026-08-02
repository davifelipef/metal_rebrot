class EnemyConfig {


    static fromComments(comments) {

        const text = comments.join("\n");


        return {

            isEnemy:
                text.includes("<abs_enemy>"),


            vision:
                this.getValue(text, "vision")

        };

    }


    static getValue(text, key) {

        const regex =
            new RegExp(`<${key}:(\\d+)>`);


        const match =
            text.match(regex);


        return match
            ? Number(match[1])
            : 0;

    }


}