'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

require('./styles.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// --
const title = 'Global Leaderboard'
// --

var Leaderboard = function (_Component) {
  _inherits(Leaderboard, _Component);

  function Leaderboard(props) {
    _classCallCheck(this, Leaderboard);

    var _this = _possibleConstructorReturn(this, (Leaderboard.__proto__ || Object.getPrototypeOf(Leaderboard)).call(this, props));

    _this.state = {
      users: _this.props.users,
      ranking: [],
      asc: false,
      alph: false,
      page: 1,
      pageMax: 1
    };
    _this.sortUsers = _this.sortUsers.bind(_this);
    _this.sortUsersByName = _this.sortUsersByName.bind(_this);
    _this.filterRank = _this.filterRank.bind(_this);
    _this.increasePage = _this.increasePage.bind(_this);
    _this.decreasePage = _this.decreasePage.bind(_this);
    return _this;
  }

  _createClass(Leaderboard, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var ranking = this.state.users;
      var paginate = this.props.paginate;
      ranking.sort(this.compareScore).reverse();
      ranking.map(function (user, index) {
        return user.rank = index + 1;
      });
      ranking.map(function (user, index) {
        return user.page = Math.ceil((index + 1) / paginate);
      });
      this.setState({ pageMax: ranking[ranking.length - 1].page });
      this.setState({ ranking: ranking });
    }
  }, {
    key: 'compareScore',
    value: function compareScore(a, b) {
      if (a.score < b.score) return -1;
      if (a.score > b.score) return 1;
      return 0;
    }
  }, {
    key: 'compareName',
    value: function compareName(a, b) {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    }
  }, {
    key: 'sortUsers',
    value: function sortUsers() {
      var ranking = this.state.ranking;
      var paginate = this.props.paginate;
      if (this.state.asc === true) {
        ranking.sort(this.compareScore).reverse();
        ranking.map(function (user, index) {
          return user.page = Math.ceil((index + 1) / paginate);
        });
        this.setState({ ranking: ranking });
        this.setState({ asc: false });
        this.setState({ alph: false });
      } else {
        ranking.sort(this.compareScore);
        ranking.map(function (user, index) {
          return user.page = Math.ceil((index + 1) / paginate);
        });
        this.setState({ ranking: ranking });
        this.setState({ asc: true });
        this.setState({ alph: false });
      }
    }
  }, {
    key: 'sortUsersByName',
    value: function sortUsersByName() {
      var ranking = this.state.ranking;
      var paginate = this.props.paginate;
      if (this.state.alph === true) {
        ranking.sort(this.compareName).reverse();
        ranking.map(function (user, index) {
          return user.page = Math.ceil((index + 1) / paginate);
        });
        this.setState({ ranking: ranking });
        this.setState({ alph: false });
        this.setState({ asc: true });
      } else {
        ranking.sort(this.compareName);
        ranking.map(function (user, index) {
          return user.page = Math.ceil((index + 1) / paginate);
        });
        this.setState({ ranking: ranking });
        this.setState({ alph: true });
        this.setState({ asc: true });
      }
    }
  }, {
    key: 'filterRank',
    value: function filterRank(e) {
      e.preventDefault();
      var ranking = this.state.users;
      var newRanking = [];
      var inputLength = e.target.value.length;
      for (var i = 0; i < ranking.length; i++) {
        var str = ranking[i].name.slice(0, inputLength).toLowerCase();
        if (str === e.target.value.toLowerCase()) {
          newRanking.push(ranking[i]);
        }
      }
      newRanking.sort(this.compareScore).reverse();
      newRanking.map(function (user, index) {
        return user.page = Math.ceil((index + 1) / 5);
      });
      this.setState({ ranking: newRanking });
      this.setState({ page: 1 });
      this.setState({ pageMax: newRanking[newRanking.length - 1].page });
    }
  }, {
    key: 'increasePage',
    value: function increasePage(e) {
      e.preventDefault();
      var page = this.state.page;
      if (page < this.state.pageMax) {
        page += 1;
      }
      this.setState({ page: page });
    }
  }, {
    key: 'decreasePage',
    value: function decreasePage(e) {
      e.preventDefault();
      var page = this.state.page;
      if (page > 1) {
        page -= 1;
      }
      this.setState({ page: page });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      return _react2.default.createElement(
        'div',
        { id: 'leaderboard-wrapper' },
        null,
        _react2.default.createElement(
          'table',
          { id: 'lBoard' },
          _react2.default.createElement(
            'tbody',
            { className: 'ranking' },
            //   _react2.default.createElement(
            //     'td',
            //     { colSpan: '10000' },
            //     // _react2.default.createElement(
            //     //   'h1',
            //     //   null,
            //     //   title
            //     // )
            // ),
            // _react2.default.createElement(
            //   'tr',
            //   null,
            //   _react2.default.createElement(
            //     'td',
            //     { colSpan: '10000' }, 
            //     _react2.default.createElement(
            //       'form',
            //       { onChange: this.filterRank },
            //       '',
            //       // _react2.default.createElement('input', { type: 'search', name: 'search', placeholder: 'User Lookup' }),
            //       // _react2.default.createElement('input', { type: 'checkbox', name: 'search', value:  }),
            //     )
            //   )
            // ),
            _react2.default.createElement(
              'tr',
              null,
              _react2.default.createElement(
                'td',
                { className: 'rank-header', onClick: this.sortUsers },
                ' Rank '
              ),
              _react2.default.createElement(
                'td',
                { className: 'rank-header', onClick: this.sortUsersByName },
                ' Name '
              ),
              _react2.default.createElement(
                'td',
                { className: 'rank-header', onClick: this.sortUsers },
                ' Score '
              )
            ),
            this.state.ranking.map(function (user, index) {
              return _react2.default.createElement(
                'tr',
                { className: 'ranking', key: index },
                user.page == _this2.state.page ? _react2.default.createElement(
                  'td',
                  { className: 'data rank' },
                  user.rank
                ) : null,
                user.page == _this2.state.page ? _react2.default.createElement(
                  'td',
                  { className: 'data name' },
                  user.name
                ) : null,
                user.page == _this2.state.page ? _react2.default.createElement(
                  'td',
                  { className: 'data score' },
                  // user.score <-- default
                  // user.score.toLocaleString('en', {useGrouping:true})
                  user.score != undefined ? Math.round(user.score).toLocaleString('en', {useGrouping:true}): user.score

                ) : null
              );
            })
          )
        ),
        _react2.default.createElement(
          'div',
            {className: 'sub-leaderboard-wrapper'},
          _react2.default.createElement(
            'button',
            {
              onClick: this.decreasePage,
              className: "leaderboard-prev-button"
            },
            'Previous'
          ),
          this.state.page == 1 ? null : _react2.default.createElement(
            'p',
            { onClick: this.decreasePage },
            ' ',
            this.state.page - 1
          ),
          _react2.default.createElement(
            'p',
            null,
            ' ',
            this.state.page
          ),
          this.state.page < this.state.pageMax ? _react2.default.createElement(
            'p',
            { onClick: this.increasePage },
            ' ',
            this.state.page + 1
          ) : null,
          _react2.default.createElement(
            'button',
            {
              onClick: this.increasePage,
              className: "leaderboard-next-button"
            },
            'Next'
          )
        )
      );
    }
  }]);

  return Leaderboard;
}(_react.Component);

exports.default = Leaderboard;