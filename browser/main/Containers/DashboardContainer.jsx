var React = require('react/addons')

module.exports = React.createClass({
  render: function () {
    return (
      <div className='DashboardContainer'>
        <h1 className='jumbotron'>Codexen App <small>v0.2.0</small></h1>

        <h2>About CodeXen</h2>

        <p>
          CodeXen is short code storage tool make coding more stressless. If you use CodeXen, then you will be disentangled from troublesome organizing a large number of snippets and googling same code many times.
        </p>

        <ol>
          <li>
            <h3>Post your code</h3>
            <p>
              Post your commonly used code with description,category,and tags.
            </p>
          </li>
          <li>
            <h3>Save on cloud</h3>
            <p>
              From short snippet to long complex code,CodeXen saves any code simply.
            </p>
          </li>
          <li>
            <h3>
              Use code like a magic
            </h3>
            <p>
              CodeXen call code you posted whereever you are.Type [shift+control+tab] simultaneously.
            </p>
          </li>
          <li>
            <h3>
              Code Elegantly
            </h3>
            <p>
              That's all!
              You must be loved with CodeXen. Enjoy coding;)
            </p>
          </li>
        </ol>
        <p>
          © 2015 MAISIN&CO.,Inc.
        </p>
      </div>
    )
  }
})
