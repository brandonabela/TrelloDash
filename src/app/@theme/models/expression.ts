import { TrelloCard } from "src/app/models/trello/trello-card";

export class BasicExpression {
  constructor(
    public key: string,
    public operation: '=' | '!=' | '~' | '!~' | '>' | '>=' | '<' | '<=',
    public value: string
  ) {}
}

export class LogicalExpression {
  constructor(
    public condition: "AND" | "OR",
    public expressions: Expression[]
  ) {}
}

export type Expression = BasicExpression | LogicalExpression;

export class EvaluateExpression {
  public static getTokens(expression: string): string[] {
    let cleanExpression = expression.replace(/\n/g, ' ');
    cleanExpression = cleanExpression.replace(/(!=|~|!~|>=?|<=?|=|>|AND|OR)([^"]*(?:"[^"]*"[^"]*)*)/g, ' $1 $2');

    const tokens = cleanExpression.match(/"[^"]+"|'[^']+'|\S+/g) || [];
    return tokens;
  }

  public static filterTokens(tokens: string[], cursorPosition: number): string[] {
    const filteredTokens: string[] = [];
    let accumulatedLength = 0;

    for (const token of tokens) {
      filteredTokens.push(token);
      accumulatedLength += token.length + 1;

      if (accumulatedLength >= cursorPosition) {
        break;
      }
    }

    return filteredTokens;
  }

  public static buildBasicExpression(tokens: string[]): BasicExpression {
    const [key, operation, value] = tokens.slice(0, 3).map(token => token.replace('_', ' ').toLowerCase());

    return new BasicExpression(key, operation as BasicExpression['operation'], value.replace(/['"]/g, '').toLowerCase());
  }

  public static buildLogicalExpression(tokens: string[]): LogicalExpression | BasicExpression {
    const leftTokens = tokens.slice(0, 3);
    const rightTokens = tokens.slice(3);

    if (rightTokens.length === 0) {
      return this.buildBasicExpression(leftTokens);
    } else {
      const leftExpression = this.buildBasicExpression(leftTokens);
      const condition = rightTokens[0] as LogicalExpression['condition'];
      const rightExpression = this.buildLogicalExpression(rightTokens.slice(1));

      return new LogicalExpression(condition, [leftExpression, rightExpression]);
    }
  }

  public static build(expression: string): Expression | null {
    const tokens = EvaluateExpression.getTokens(expression);
    return (tokens.length - 3) % 4 === 0 ? this.buildLogicalExpression(tokens) : null;
  }


  public static getPropertyValues(trelloCards: TrelloCard[], key: string): string[] {
    key = key.replace('_', ' ').toLowerCase();

    const propertyValues = trelloCards.map(trelloCard => {
      const value = TrelloCard.getCardPropertyValue(trelloCard, key).toString();
      return `"${value}"`;
    });

    const uniquePropertyValues = [...new Set(propertyValues)];
    return uniquePropertyValues;
  }

  public static evaluateBasicExpression(basicExpression: BasicExpression, trelloCard: TrelloCard): boolean {
    const propValue = TrelloCard.getCardPropertyValue(trelloCard, basicExpression.key).toString().toLowerCase();
    const value = basicExpression.value;

    switch (basicExpression.operation) {
      case '=': return propValue === value;
      case '!=': return propValue !== value;
      case '~': return propValue.includes(value);
      case '!~': return !propValue.includes(value);
      case '>': return Number(propValue) > Number(value);
      case '>=': return Number(propValue) >= Number(value);
      case '<': return Number(propValue) < Number(value);
      case '<=': return Number(propValue) <= Number(value);
      default: return propValue === value;
    }
  }

  public static evaluateLogicalExpression(logicalExpression: LogicalExpression, trelloCard: TrelloCard): boolean {
    const { condition, expressions } = logicalExpression;

    const fn = condition === 'AND' ? expressions.every : expressions.some;

    return fn.call(expressions, (expression) => {
      if ("condition" in expression) {
        return this.evaluateLogicalExpression(expression, trelloCard);
      } else {
        return this.evaluateBasicExpression(expression, trelloCard);
      }
    });
  }

  public static evaluate(expression: Expression, trelloCard: TrelloCard): boolean {
    if ("condition" in expression) {
      return this.evaluateLogicalExpression(expression, trelloCard);
    } else {
      return this.evaluateBasicExpression(expression, trelloCard);
    }
  }
}
