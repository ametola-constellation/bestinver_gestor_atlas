using System;
using System.Collections.Generic;
using System.Text;

namespace BESTINVER.GestorAltas.Web.Common.Rules
{
    public class RuleException:System.Exception
    {
        public IEnumerable<string> Messages { get; }

        public RuleException(params string[] messages)
        {
            Messages = messages;
        }

    }
}
