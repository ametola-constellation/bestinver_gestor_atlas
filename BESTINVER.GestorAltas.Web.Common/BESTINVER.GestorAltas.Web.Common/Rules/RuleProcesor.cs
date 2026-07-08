using bestinver.crossapp.common.rules;
using BESTINVER.GestorAltas.Web.Common.Exceptions;
using BESTINVER.GestorAltas.Web.Common.Rules.Login;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.Web.Common.Rules
{
    internal class RuleProcesor<T> : IRuleProcessor<T> where T : class
    {
        public IEnumerable<IRule<T>> Rules { get; }
        public RuleProcesor(IEnumerable<IRule<T>> rules)
        {
            Rules = rules;
        }

        public async Task<bool> CheckRules(T entity)
        {
            try
            {
                var tasks = Rules.Select(x => x.Check(entity)).ToArray();
                var result = await Task.WhenAll(tasks);
            }
            catch (LoginException ex)
            {
                throw new RuleException(ex.FriendlyMessage);
            }
            
            return true;
        }
    }
}
