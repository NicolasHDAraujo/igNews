import { query as q } from 'faunadb';
import { fauna } from "../../../services/fauna";
import { stripe } from '../../../services/stripe';

//arquivos em api com "_" não serão tratados como rota
export async function saveSubscription(
  subscriptionId: string,
  customerId: string,
  createAction = false,
) {
  //para se buscar o usuário pelo customer do stripe customer id, é necessário criar o indice no banco fauna
  const userRef = await fauna.query(
    q.Select(
      "ref",//apenas os campos que eu queira usar
      q.Get(
        q.Match(
          q.Index("user_by_stripe_customer_id"), //pegar os usuários que o customer id seja igual
          customerId
        )
      )
    )
  )

  const subscription = await stripe.subscriptions.retrieve(subscriptionId)// pegar todos os dados

  const subscriptionData = {
    id: subscription.id,
    userId: userRef,
    status: subscription.status,
    price_id: subscription.items.data[0].price.id,
  }

  if (createAction) {
    await fauna.query(//salvar no banco
      q.Create(
        q.Collection(
          "subscriptions"
        ),
        { data: subscriptionData }
      )
    )
  } else {
    await fauna.query(
      q.Replace( //atualizar dados
        q.Select(
          "ref",
          q.Get(
            q.Match(
              q.Index('subscription_by_id'),
              subscriptionId,
            )
          )
        ),
        { data: subscriptionData } //quais dados atualizar no Replace
      )
    )
  }
}
