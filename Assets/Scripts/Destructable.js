#pragma strict

public class Destructable extends MonoBehaviour
{
	private var burn_frequency_timer : float = 0.0f;
	private var burn_timer : float = 0.0f;
	protected var burn_total : int = 0;
	protected var burn_object : GameObject;
	protected var burning : boolean = false;
	protected var health : int;
	protected var max_health : int;
	
	function Update()
	{
		if(burning)
		{
			burn_timer += Time.deltaTime;
			burn_frequency_timer += Time.deltaTime;
			if(burn_frequency_timer > .3)
			{
				burn_frequency_timer = 0.0f;
				Burn(1);
			}
			if(burn_timer >= 3.0f)
			{
				burning = false;
				if(burn_object != null)
				{
					burn_object.GetComponent(Tower).increaseDamageDealt(burn_total);
				}
				burn_total = 0;
			}
		}
	}
	function Get_Health() : int
	{
		return health;
	}

	function Get_Max_Health() : int
	{
		return max_health;
	}
	
	function Hurt() : boolean
	{
		return health < max_health;
	}
	
	function takeDamage(dmg_packet : List.<Object>)
	{
		var damage : int = System.Convert.ToInt32(dmg_packet[0]);
		var attacker : GameObject = dmg_packet[1] as GameObject;
		//attacker.GetComponent(Tower).increaseDamageDealt(Mathf.Min(damage, health));
		Display_Damage(damage);
		health -= damage;
		if(health <= 0)
		{
			Death();
		}
	}
	
	function Burn(damage : int)
	{
		burn_total += damage;
		Display_Damage(damage);
		health -= damage;
		if(health <= 0)
		{
			Burn_Death();
		}
	}
	
	function Set_Burn()
	{
		burning = true;
	}
	
	function Display_Damage(amount : int)
	{
		var damage_number : GameObject = Instantiate(Resources.Load("Damage Number") as GameObject, gameObject.transform.position, Quaternion.identity);
		damage_number.GetComponent.<GUIText>().text = amount.ToString();
		damage_number.GetComponent(DamageNumber).linkObject(transform.position);
	}
	
	function Burn_Death()
	{
		Death();
	}
	
	//MUST BE OVERWRITTEN
	function Death()
	{}
}