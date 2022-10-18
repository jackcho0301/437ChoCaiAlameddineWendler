import random

# in the future we can add commodities, options, even other portfolios
tickers = ['AAPL', 'MSFT', 'AMZN', 'GOOGL', 'TSLA', 'NVDA', 'MRNA', 'BRK-A', 'NFLX', 'KO']

number_of_stocks = random.randint(3, len(tickers))

# in the future this will come from API
values = [x/10 for x in random.sample(range(1, 1000), number_of_stocks)]

starting_money = 10**3
weights = random.sample(range(1, starting_money), number_of_stocks)
weights = [x*starting_money/sum(weights) for x in weights]

portfolio = {}

for weight in weights:
    random.shuffle(tickers)
    portfolio[tickers.pop()] = weight/(starting_money/100)

portfolio_vals = {x: y/values[i] for i, (x, y) in enumerate(portfolio.items())}

print('Portfolio Weights:', portfolio)
print('Portfolio Values:', portfolio_vals)
# print('Sum of weights:', sum(weights))